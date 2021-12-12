import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import Card from "../../models/CardModel";
import { alignDeck } from "../../engines/SolitaireEngine.js";

const conversions = [
  "A",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "J",
  "Q",
  "K",
];

class Blackjack extends React.Component {
  client;
  gameId = window.location.href.split("/").pop().split("#")[0].split("?")[0];

  constructor() {
    super();
    this.client = io("localhost:8001", {
      query: {
        id: this.gameId,
      },
      reconnection: false,
    });

    this.state = {
      player: [],
      dealer: [],
      bets: [],
      currentBet: 0,
      playerCount: 1,
      turn: false,
      bank: 1000,
    };

    this.bet = this.bet.bind(this);
    this.stand = this.stand.bind(this);
    this.hit = this.hit.bind(this);

    this.resizeHandler = this.resizeHandler.bind(this);
  }

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
        bet: this.state.bets.map(bet => bet.bet = 0)
      });

      this.resizeHandler();
    });

    this.client.on("game_update", (numOfPlayers, dealerCardCount, bets, turn) => {
      // any changes to dealer and other players
      this.setState({
        playerCount: numOfPlayers,
        dealer: [...this.state.dealer, ...Array(Math.max(this.state.dealer.length - dealerCardCount, 0)).fill(new Card("blank", "blank", "blank", "blank", true, 0, 0))],
        bets: bets || [],
        turn: this.client.id === turn,
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

  hit() {
    if (this.state.turn) {
      this.client.emit("hit");
    }
  }

  bet(value) {
    if (this.state.turn) {
      return () => {
        this.client.emit("bet", value, (verify) => {
          if (verify) {
            this.setState({
              currentBet: value,
              bank: this.state.bank + this.state.currentBet - value,
            });
          }
        });
      };
    }
  }

  stand() {
    if (this.state.turn) {
      this.client.emit("stand");
    }
  }

  render() {
    const { player, dealer, bets, currentBet, bank } = this.state;

    console.log(bets);

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
          Board
          <p>
            {bets.map((bet) => "\n" + bet.playerName + ": " + "$" + bet.bet)}
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
