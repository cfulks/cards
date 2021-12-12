/**
 * Handle many different blackjack games in an object
 *
 * {
 *  "ROOM_ID": {
 *      deck: [],
 *      players: [{ hand: [], bets: [] }],
 *      dealer: { hand: [] }
 *      currentTurn: 0
 *  }
 * }
 */

class BlackjackEngine {
  static games = {};
  static deck = [];

  static getGame = (id) => {
    return BlackjackEngine.games[id];
  };

  static removeGame = (id) => {
    delete BlackjackEngine.games[id];
  };

  static createGame = (id, io) => {
    if (!(id in BlackjackEngine.games)) {
      BlackjackEngine.games[id] = new Game(io.to(id));
    }
  };

  static build() {
    if (typeof BlackjackEngine.instance === "undefined") {
      BlackjackEngine.instance = new BlackjackEngine();

      // prettier-ignore
      for (let i = 0; i < 13; i++) {
        BlackjackEngine.deck.push({ value: i + 1, suit: "hearts", color: "Red" });
        BlackjackEngine.deck.push({ value: i + 1, suit: "diamonds", color: "Red" });
        BlackjackEngine.deck.push({ value: i + 1, suit: "spades", color: "Black" });
        BlackjackEngine.deck.push({ value: i + 1, suit: "clubs", color: "Black" });
      }
    }
  }
}

class Game {
  players = {};
  dealer = [];
  playerTurn = 1;
  room;
  gameOverTimeout;

  playerOrder = [undefined];

  constructor(room) {
    this.room = room;
    this.dealer = [
      BlackjackEngine.deck[
        Math.floor(BlackjackEngine.deck.length * Math.random())
      ],
      BlackjackEngine.deck[
        Math.floor(BlackjackEngine.deck.length * Math.random())
      ],
    ];

    this.addPlayer = this.addPlayer.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.bet = this.bet.bind(this);
    this.stand = this.stand.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
  }

  removePlayer = (socketId) => {
    let currentPlayerTurn = this.playerTurn % this.playerOrder.length;
    if (currentPlayerTurn <= this.playerOrder.indexOf(socketId)) {
      if (this.playerOrder.length === 2) {
        this.playerTurn = 1;
      } else {
        this.playerTurn = currentPlayerTurn % (this.playerOrder.length - 1);
      }
    } else {
      this.playerTurn = Math.max(currentPlayerTurn - 1, 1);
    }

    delete this.players[socketId];
    this.playerOrder = this.playerOrder.filter((item) => item !== socketId);
  };

  addPlayer = (socketId, socket) => {
    this.playerOrder.push(socketId);
    this.players[socketId] = {
      bet: 0,
      bank: 1000,
      hand: [
        BlackjackEngine.deck[
          Math.floor(BlackjackEngine.deck.length * Math.random())
        ],
        BlackjackEngine.deck[
          Math.floor(BlackjackEngine.deck.length * Math.random())
        ],
      ],
      socket: socket,
      drawCard: false,
      stand: false,
    };
    socket.emit(
      "setup",
      Object.keys(this.players).length,
      this.players[socketId].hand,
      this.dealer[0],
      this.players[socketId].bank,
      this.playerOrder[this.playerTurn % this.playerOrder.length]
    );

    let bets = [];
    let counter = 1;

    for (let p in this.players) {
      bets.push({
        playerName: `Player ${counter++}`,
        bet: this.players[p].bet,
      });
    }

    this.room.emit(
      "game_update",
      Object.keys(this.players).length,
      this.dealer.length,
      bets,
      this.playerOrder[this.playerTurn % this.playerOrder.length]
    );
  };

  currentTurn(player) {
    return (
      this.playerOrder[this.playerTurn % this.playerOrder.length] === player
    );
  }

  calculateCardValue(hand) {
    let handValue = 0;
    let numAces = 0;

    for (let v = 0; v < hand.length; v++) {
      if (hand[v].value === 1) {
        numAces++;
      } else if (hand[v].value >= 10) {
        handValue += 10;
      } else {
        handValue += hand[v].value;
      }
    }

    if (numAces > 0) {
      if (handValue + 11 + (numAces - 1) > 21) {
        handValue += numAces;
      } else {
        handValue += 11 + (numAces - 1);
      }
    }
    return handValue;
  }

  drawCard = (player) => {
    let card =
      BlackjackEngine.deck[
        Math.floor(BlackjackEngine.deck.length * Math.random())
      ];
    this.players[player].hand.push(card);

    return card;
  };

  stand = (player) => {
    this.players[player].stand = true;
  };

  bet = (player, value) => {
    let success = false;
    if (this.currentTurn(player)) {
      if (
        value <= this.players[player].bank &&
        this.players[player].bet < value
      ) {
        this.players[player].bet = value;
        success = true;
      }

      this.playerTurn--;
    }
    return success;
  };

  updateGame = () => {
    // Skips players until a player that hasn't "standed"
    while (
      this.playerOrder[++this.playerTurn % this.playerOrder.length] !==
        undefined &&
      this.players[this.playerOrder[this.playerTurn % this.playerOrder.length]]
        .stand
    );

    let bets = [];
    let counter = 1;
    let roundOver = false;

    for (let p in this.players) {
      bets.push({
        playerName: `Player ${counter++}`,
        bet: this.players[p].bet,
      });
    }

    if (
      this.playerOrder[this.playerTurn % this.playerOrder.length] === undefined
    ) {
      let playerHit = false;

      let everyoneBusted = true;

      for (let p in this.players) {
        if (this.players[p].drawCard) {
          this.drawCard(p);
          this.players[p].socket.emit("update_hand", this.players[p].hand);
          playerHit = true;
          this.players[p].drawCard = false;

          if (this.calculateCardValue(this.players[p].hand) >= 21) {
            this.players[p].stand = true;
          }

          everyoneBusted = everyoneBusted && this.players[p].stand;
        }
      }

      if (!playerHit || everyoneBusted) {
        this.playerTurn = 1;
        // DEALER LOGIC GOES HERE
        /** Source: https://bicyclecards.com/how-to-play/blackjack/
         * When the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand.
         * If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand.
         * If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand.
         * The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.
         */

        roundOver = true;

        //dealer must stand if their first two cards >= 17
        while (this.calculateCardValue(this.dealer) < 17) {
          this.dealer.push(
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ]
          );
        }

        this.room.emit(
          "show_dealer",
          this.dealer,
          this.calculateCardValue(this.dealer)
        );

        this.gameOverTimeout = setTimeout(() => {
          let newDealer = [
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ],
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ],
          ];
          //locking players out when they go broke
          for (let p in this.players) {
            //Betting payout
            if (this.calculateCardValue(this.players[p].hand) > 21) {
              this.players[p].bank = this.players[p].bank - this.players[p].bet;
            } else if (this.calculateCardValue(this.dealer) > 21) {
              this.players[p].bank += this.players[p].bet;
            } else if (
              this.calculateCardValue(this.players[p].hand) >
              this.calculateCardValue(this.dealer)
            ) {
              this.players[p].bank += this.players[p].bet;
            } else if (
              this.calculateCardValue(this.players[p].hand) ==
              this.calculateCardValue(this.dealer)
            ) {
              // Do nothing
            } else {
              this.players[p].bank = this.players[p].bank - this.players[p].bet;
            }

            this.players[p].bet = 0;

            //locking out player when they go broke
            if (this.players[p].bank <= 0) {
              this.players[p].socket.disconnect(true);
            } else {
              this.players[p].hand = [];
              this.players[p].stand = false;
              this.drawCard(p);
              this.drawCard(p);

              this.players[p].socket.emit(
                "setup",
                Object.keys(this.players).length,
                this.players[p].hand,
                newDealer[0],
                this.players[p].bank,
                this.playerOrder[this.playerTurn % this.playerOrder.length]
              );
            }
          }

          this.dealer = newDealer;
        }, 5000);
      } else {
        while (
          this.playerOrder[++this.playerTurn % this.playerOrder.length] !==
            undefined &&
          this.players[
            this.playerOrder[this.playerTurn % this.playerOrder.length]
          ].stand
        );
      }
    }

    if (!roundOver) {
      this.room.emit(
        "game_update",
        Object.keys(this.players).length,
        this.dealer.length,
        bets,
        this.playerOrder[this.playerTurn % this.playerOrder.length]
      );
    }
  };
}

export default BlackjackEngine;
