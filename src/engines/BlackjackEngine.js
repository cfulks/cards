/**
 * Engine for controlling many different Blackjack games
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

  /**
   * Builds up a deck to be used by all Blackjack games.
   * Given the deck will be randomly accessed and never modified, no shuffling is required.
   */
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
export default BlackjackEngine;

/**
 * Game instances hold the entire game state for each individual Blackjack game.
 * It includes a socket.io channel which all of the players exist in to be updated with game state changes.
 */
export class Game {
  players = {};
  dealer = [];
  playerTurn = 1;
  room;
  gameOverTimeout;

  // undefined represents the dealer in the player's order
  playerOrder = [undefined];

  /**
   * Constructor for creating Game instances
   * @param {Room} room the specific room for this Blackjack game
   */
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

    // Binding here is to keep the proper scope for these methods
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    this.addPlayer = this.addPlayer.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.bet = this.bet.bind(this);
    this.stand = this.stand.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
  }

  /**
   * Removes any player from the game. It adjusts the current turn in the blackjack game
   * accordingly to prevent a game where a nonexistent player has to make a move
   * @param {String} socketId the player id that needs to be removed
   */
  removePlayer = (socketId) => {
    if (socketId !== undefined) {
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
    }
  };

  /**
   * Adds a player to the game. It sets up the client with all the necessary information and
   * updates the other players with the new player count
   * @param {String} socketId
   * @param {Socket} socket
   */
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

    /*
     * This serves two purposes. The first is to update all other users with the new player count, but
     * it also gives the remaining necessary information to the user (bets, current player #, etc.)
     */
    this.room.emit(
      "game_update",
      Object.keys(this.players).length,
      this.dealer.length,
      bets,
      this.playerOrder[this.playerTurn % this.playerOrder.length],
      this.playerTurn % this.playerOrder.length
    );
  };

  /**
   * Checks whether the player is allowed to make a move
   * @param {String} socketId player's id to be checked
   * @returns whether it is the given player's turn
   */
  currentTurn(socketId) {
    return (
      this.playerOrder[this.playerTurn % this.playerOrder.length] === socketId
    );
  }

  /**
   * This calculates the value of a hand. It automatically sets aces as either
   * 1 or 11 based on whether it'll make the player bust.
   * @param {Object[]} hand a list of cards
   * @returns the total value of the hand
   */
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

  /**
   * This draws a random card from the sorted deck of cards in the blackjack engine and then
   * puts it in the player's hand, regardless of whether the player is allowed to draw a card.
   * All validation for the hands should be done elsewhere.
   * @param {*} socketId id of the player that needs a new card
   */
  drawCard = (socketId) => {
    let card =
      BlackjackEngine.deck[
        Math.floor(BlackjackEngine.deck.length * Math.random())
      ];
    this.players[socketId].hand.push(card);
  };

  /**
   * The stand method stops the player from continuing to draw cards or bet. It will
   * also cause them to be skipped until the game is complete, since they have no more
   * actions to perform.
   * @param {String} socketId id of the player
   */
  stand = (socketId) => {
    this.players[socketId].stand = true;
  };

  /**
   *
   * @param {String} socketId id of the player
   * @param {Number} value bet by the player
   * @returns if the bet was placed
   */
  bet = (socketId, value) => {
    let success = false;
    if (this.currentTurn(socketId) && this.players[socketId].hand.length == 2) {
      if (
        value <= this.players[socketId].bank &&
        this.players[socketId].bet < value
      ) {
        this.players[socketId].bet = value;
        success = true;
      }

      this.playerTurn--;
    }
    return success;
  };

  /**
   * This method keeps the game moving after any actions performed by the players.
   */
  updateGame = () => {
    // Skips all players until there is a player that hasn't "standed"
    // It will also stop for the dealer (meaning the round is over).
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
            this.stand(p);
          }

          everyoneBusted = everyoneBusted && this.players[p].stand;
        }
      }

      if (!playerHit || everyoneBusted) {
        this.playerTurn = 1;
        /** Source: https://bicyclecards.com/how-to-play/blackjack/
         * When the dealer has served every player, the dealers face-down card is turned up. If the total is 17 or more, it must stand.
         * If the total is 16 or under, they must take a card. The dealer must continue to take cards until the total is 17 or more, at which point the dealer must stand.
         * If the dealer has an ace, and counting it as 11 would bring the total to 17 or more (but not over 21), the dealer must count the ace as 11 and stand.
         * The dealer's decisions, then, are automatic on all plays, whereas the player always has the option of taking one or more cards.
         */

        roundOver = true;

        // Dealer must stand if the value of their hand is greater than or equal to 17
        while (this.calculateCardValue(this.dealer) < 17) {
          this.dealer.push(
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ]
          );
        }

        // Updates everyone in the room with the hand of the dealer.
        this.room.emit(
          "show_dealer",
          this.dealer,
          this.calculateCardValue(this.dealer)
        );

        /*
         * This serves to reset the game after a completed round. It gives the playerbase 5 seconds
         * to see the results of a completed round before restarting.
         */
        this.gameOverTimeout = setTimeout(() => {
          let newDealer = [
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ],
            BlackjackEngine.deck[
              Math.floor(BlackjackEngine.deck.length * Math.random())
            ],
          ];

          for (let p in this.players) {
            // Betting payout - The dealer always wins busts
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
              this.calculateCardValue(this.players[p].hand) <
              this.calculateCardValue(this.dealer)
            ) {
              this.players[p].bank = this.players[p].bank - this.players[p].bet;
            } // If the hands are equal, we don't do anything.

            this.players[p].bet = 0;

            // Locking players out when they go broke. They will now receive no more updates about the game.
            if (this.players[p].bank <= 0) {
              this.players[p].socket.disconnect(true);
            } else {
              /*
               * Resets the player's game information.
               * There is no need to send a game_update as all players are aware of the player bets
               * and will reset them to 0 accordingly
               */
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
        // After the dealer's turn, if the game is still continuing, this needs to loop again.
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
        this.playerOrder[this.playerTurn % this.playerOrder.length],
        this.playerTurn % this.playerOrder.length
      );
    }
  };
}
