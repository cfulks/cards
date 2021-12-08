import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import Card from "../../models/CardModel";

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
    });

    this.state = {
      hand: [],
    };

    this.bet = this.bet.bind(this);
    this.hit = this.hit.bind(this);
  }

  hit() {
    this.client.emit("hit", (value, suit, color) => {
      this.setState({
        hand: [
          ...this.state.hand,
          new Card(value, conversions[value - 1], suit, color, false, 500, 500),
        ],
      });
    });
  }

  bet(value) {
    return () => {
      console.log(value);
    };
  }

  render() {
    const { hand } = this.state;

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
            Bank: $1000<i className="fa fa-caret-down"></i>
          </button>
          <div className="container" style={{ display: "block" }}>
            <button className="allin" onClick={this.bet(-1)}>
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
        <div className="display"></div>
        <div className="game">
          <div className="options" onClick={this.hit}>
            Hit
          </div>
          <div className="options" onClick="">
            Stand
          </div>
          <div className="options" onClick="">
            Double X2
          </div>
          {hand.map((card) => card.internalCard)}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Blackjack />, document.getElementById("main"));
