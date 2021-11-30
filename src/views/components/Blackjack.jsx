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

  constructor() {
    super();
    this.client = io("localhost:8001");

    this.state = {
      hand: [],
    };
  }

  componentDidMount() {
    this.client.emit("hit", (value, suit, color) => {
      this.setState({
        hand: [
          ...this.state.hand,
          new Card(value, conversions[value - 1], suit, color, false, 100, 100),
        ],
      });
    });
  }

  render() {
    const { hand } = this.state;

    if (hand.length > 0) {
      return <div>{hand[0].internalCard}</div>;
    } else {
      return <div>No Cards</div>;
    }
  }
}

ReactDOM.render(<Blackjack />, document.getElementById("main"));
