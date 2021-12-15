import React from "react";
import Card from "../views/components/Card.jsx";

/**
 * Card Model for both games
 */
class CardModel {
  // This static counter prevents key conflicts in rendering
  static keyCounter = 0;

  /**
   * Constructor for creating a new card. By default, cards are hidden and located at (0,0)
   * @param {Number} value the underlying value of the card
   * @param {String} cardName the specific name of the card
   * @param {String} suit One of the following strings: hearts/diamonds/spades/clubs
   * @param {String} color One of the following strings: Red/Black
   * @param {Boolean} hidden whether the card is flipped over
   * @param {Number} x starting x-coordinate of the card
   * @param {Number} y starting y-coordinate of the card
   */
  constructor(value, cardName, suit, color, hidden = true, x = 0, y = 0) {
    this.value = value;
    this.suit = suit;
    this.color = color;
    this.cardName = cardName;
    this.hidden = hidden;
    this.x = x;
    this.y = y;
    this.inHand = false;

    // This is the internal React card used for rendering
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

  /**
   * Handles moving cards on the screen from one location to another.
   * Assuming the base location of the card is (0,0), x1 and y1 can be treated as coordinates
   * @param {Number} x1 the amount of pixels being moved horizontally
   * @param {Number} y1 the amount of pixels being moved vertically
   */
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
