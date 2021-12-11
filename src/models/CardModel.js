import React from "react";
import Card from "../views/components/Card.jsx";

class CardModel {
  static keyCounter = 0;

  constructor(value, cardName, suit, color, hidden = true, x = 0, y = 0) {
    this.value = value;
    this.suit = suit;
    this.color = color;
    this.cardName = cardName;
    this.hidden = hidden;
    this.x = x;
    this.y = y;
    this.inHand = false;

    this.internalCard = (
      <Card
        hidden={hidden}
        value={cardName}
        suit={suit}
        moving={false}
        position={{ x, y }}
        pickUpCard={this.pickUpCard}
        key={"CARD-" + cardName + suit + value + CardModel.keyCounter++}
      />
    );

    this.pickUpCard = this.pickUpCard.bind(this);
    this.updateCardPosition = this.updateCardPosition.bind(this);
  }

  pickUpCard = (inHand) => {
    this.inHand = this.hidden ? false : inHand;
  };

  updateCardPosition = (x1, y1) => {
    let { x, y } = this.internalCard.props.position;

    this.x = x1 + x;
    this.y = y1 + y;

    this.internalCard = (
      <Card
        hidden={this.hidden}
        value={this.cardName}
        suit={this.suit}
        moving={x1 < 100 || y1 < 100}
        position={{ x: this.x, y: this.y }}
        pickUpCard={this.pickUpCard}
        key={
          "CARD-" +
          this.cardName +
          this.suit +
          this.value +
          CardModel.keyCounter++
        }
      />
    );
  };
}

export default CardModel;
