import React from "react";
import PropTypes from "prop-types";

/**
 * Card class for rendering a card in both games.
 */
class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, suit, position, pickUpCard, hidden, moving, blank } =
      this.props;

    if (blank) {
      return (
        <span
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
          }}
          className={"card empty"}
          key={"BLANK-" + value}
        ></span>
      );
    } else {
      return (
        <span
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            ...(moving && { zIndex: 100000 }), // Cards should be on the very top if they're moving
          }}
          className={hidden ? "card back" : ["card", value, suit].join(" ")}
          onMouseDown={() => pickUpCard(true)} // Updates the CardModel that the card was picked up
          key={value + suit}
        ></span>
      );
    }
  }
}

Card.propTypes = {
  value: PropTypes.string.isRequired,
  position: PropTypes.any.isRequired,
  moving: PropTypes.bool,
  suit: PropTypes.string,
  pickUpCard: PropTypes.func,
  hidden: PropTypes.bool,
  blank: PropTypes.bool,
};

export default Card;
