import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import Card from "../../models/CardModel";
import { alignDeck, conversions } from "../../engines/SolitaireEngine.js";

/**
 * Blackjack game rendering for the client. Any prettier-ignore comments are to help with
 * keeping formatting uniform.
 */
class Blackjack extends React.Component {
  // Specific socket.io-client for emitting events.
  client;
  // Gets the gameId from the URL
  gameId = window.location.href.split("/").pop().split("#")[0].split("?")[0];

  /**
   * Creates a React component with the necessary information for a Blackjack game
   */
  constructor() {
    super();
    this.client = io("localhost:8001", {
      query: {
        id: this.gameId,
      },
      reconnection: false,
      /* If connection is lost, we don't want misconfiguration to happen when
       * the client reconnects, so we force them to reload the page and get a clean slate instead
       */
    });

    this.state = {
      player: [],
      dealer: [],
      bets: [],
      currentBet: 0,
      playerCount: 1,
      turn: false,
      turnNumber: 1,
      bank: 1000,
    };

    // Binds methods to this
    this.bet = this.bet.bind(this);
    this.stand = this.stand.bind(this);
    this.hit = this.hit.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  /**
   * Realigns the player and dealer decks and forces a client update. As is, this isn't perfect
   * on smaller viewports
   * @param {Boolean} showTopDealer whether to show the top dealer card
   */
  // prettier-ignore
  resizeHandler(showTopDealer=false) {
    const cardWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.07 / 2;
    const x = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) / 2;
    const y = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) / 2 - (x * 0.07 * 176) / 114 / 2;
      

    if (this.state.player.length !== 0) {
      this.setState({
        player: alignDeck(this.state.player, x - (50 * this.state.player.length-1 + cardWidth) / 2, y + y/4, undefined, false, true, 2, true),
        dealer: alignDeck(this.state.dealer, x - (50 * this.state.dealer.length-1 + cardWidth) / 2, y - y/4, undefined, !showTopDealer, true, 2, true),
      });
    }

    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.resizeHandler(false));
  }

  /**
   * Sets up the client for incoming events from the socket.io server
   */
  // prettier-ignore
  componentDidMount() {
    window.addEventListener("resize", () => this.resizeHandler(false));
    this.client.on("setup", (numOfPlayers, startingHand, dealerHand, bank, turn) => {
      this.setState({
        playerCount: numOfPlayers,
        player: 
          [
            new Card(startingHand[0].value, conversions[startingHand[0].value - 1], startingHand[0].suit, startingHand[0].color, false, 0, 0),
            new Card(startingHand[1].value, conversions[startingHand[1].value - 1], startingHand[1].suit, startingHand[1].color, false, 0, 0),
          ],
        dealer:
          [
            new Card(dealerHand.value, conversions[dealerHand.value - 1], dealerHand.suit, dealerHand.color, false, 0, 0),
            new Card("blank", "blank", "blank", "blank", true, 0, 0),
          ],
        bank: bank,
        turn: this.client.id === turn,
        currentBet: 0,
        turnNumber: 1
      });

      this.resizeHandler();
    });

    this.client.on("game_update", (numOfPlayers, dealerCardCount, bets, turn, turnNumber) => {
      // Any changes to dealer and other players
      this.setState({
        playerCount: numOfPlayers,
        dealer: [...this.state.dealer, ...Array(Math.max(this.state.dealer.length - dealerCardCount, 0)).fill(new Card("blank", "blank", "blank", "blank", true, 0, 0))],
        bets: bets || [],
        turn: this.client.id === turn,
        turnNumber: turnNumber
      });

      this.resizeHandler();
    });

    this.client.on("update_hand", (hand) => {
      this.setState({
        player: hand.map(c => new Card(c.value, conversions[c.value - 1], c.suit, c.color, false, 0, 0))
      })
    });

    this.client.on("show_dealer", (dealerHand, dealerValue) => {
      this.setState({
        dealer: dealerHand.map(c => new Card(c.value, conversions[c.value - 1], c.suit, c.color, false, 0, 0))
      });
      this.resizeHandler(true);
    });
  }

  /**
   * Allows the player to hit
   */
  hit() {
    if (this.state.turn) {
      this.client.emit("hit");
    }
  }

  /**
   * Allows the player to bet
   * @param {Number} value bet amount
   */
  bet(value) {
    if (this.state.turn && this.state.player.length == 2) {
      return () => {
        this.client.emit("bet", value, (verify) => {
          if (verify) {
            // Only update the bet locally if it worked
            this.setState({
              currentBet: value,
              bank: this.state.bank + this.state.currentBet - value,
            });
          }
        });
      };
    }
  }

  /**
   * Allows the player to stand
   */
  stand() {
    if (this.state.turn) {
      this.client.emit("stand");
    }
  }

  /**
   * Renders the Blackjack game
   * @returns the JSX object to be rendered by react
   */
  render() {
    const { player, dealer, bets, currentBet, bank, turnNumber } = this.state;

    let inc = turnNumber - 1;

    return (
      <div id="game">
        <div className="bank">
          <button
            className="bank-button"
            onClick={() => {
              let elem = document.getElementsByClassName("bank-button")[0];
              elem.classList.toggle("active");
              var dropdownContent = elem.nextElementSibling;
              if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
              } else {
                dropdownContent.style.display = "block";
              }
            }}
          >
            Bank: ${bank}
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="container" style={{ display: "block" }}>
            <button className="allin" onClick={this.bet(bank + currentBet)}>
              All In
            </button>
            <div className="pokerchip btn one" onClick={this.bet(1)}></div>
            <div className="pokerchip btn two" onClick={this.bet(5)}></div>
            <div className="pokerchip btn three" onClick={this.bet(25)}></div>
            <div className="pokerchip btn four" onClick={this.bet(50)}></div>
            <div className="pokerchip btn five" onClick={this.bet(100)}></div>
            <div className="pokerchip btn six" onClick={this.bet(500)}></div>
            <div className="pokerchip btn seven" onClick={this.bet(1000)}></div>
          </div>
        </div>
        <div className="board">
          <span>Board</span>
          <p>
            {bets.map((bet) =>
              inc-- == 0 ? (
                <span style={{ color: "#00ff55" }}>
                  {bet.playerName + ": " + "$" + bet.bet + "\n"}
                </span>
              ) : (
                bet.playerName + ": " + "$" + bet.bet + "\n"
              )
            )}
          </p>
        </div>
        <div className="game">
          <div className="options" onClick={this.hit}>
            Hit
          </div>
          <div className="options" onClick={this.stand}>
            Stand
          </div>
          <div className="options" onClick={this.bet(currentBet * 2)}>
            Double X2
          </div>
          {player.map((card) => card.internalCard)}
          {dealer.map((card) => card.internalCard)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Blackjack />, document.getElementById("main"));
