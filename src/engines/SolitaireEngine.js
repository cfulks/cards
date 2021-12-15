import Card from "../models/CardModel.js";

export const conversions = [
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

/**
 * Generic shuffle method for arrays. Used for shuffling a solitaire deck before
 * splitting it up into the proper piles
 * @param {Object[]} deck list of any objects
 */
export const shuffleDeck = (deck) => {
  for (let i = 0; i < deck.length; i++) {
    let randIndex = Math.floor(Math.random() * deck.length);
    if (randIndex == deck.length) {
      continue;
    }

    let temp = deck[randIndex];
    deck[randIndex] = deck[i];
    deck[i] = temp;
  }
};

/**
 * Configures a game of Solitaire for the client to use
 * @returns a new solitaire game
 */
export const createGame = () => {
  let deck = [];
  for (let i = 0; i < 13; i++) {
    deck.push(new Card(i + 1, conversions[i], "hearts", "Red"));
    deck.push(new Card(i + 1, conversions[i], "diamonds", "Red"));
    deck.push(new Card(i + 1, conversions[i], "spades", "Black"));
    deck.push(new Card(i + 1, conversions[i], "clubs", "Black"));
  }

  shuffleDeck(deck);

  let { cardSize, positions } = calculatePositions();

  return {
    cardSize,
    positions,
    gameDeck: {
      deck: alignDeck(
        deck.slice(0, 24),
        positions.deck.x,
        positions.deck.y,
        false,
        true
      ),
      discard: [],
      foundation: [[], [], [], []],
      stack: [
        alignDeck(
          deck.slice(24, 25),
          positions.stack[0].x,
          positions.stack[0].y
        ),
        alignDeck(
          deck.slice(25, 27),
          positions.stack[1].x,
          positions.stack[1].y
        ),
        alignDeck(
          deck.slice(27, 30),
          positions.stack[2].x,
          positions.stack[2].y
        ),
        alignDeck(
          deck.slice(30, 34),
          positions.stack[3].x,
          positions.stack[3].y
        ),
        alignDeck(
          deck.slice(34, 39),
          positions.stack[4].x,
          positions.stack[4].y
        ),
        alignDeck(
          deck.slice(39, 45),
          positions.stack[5].x,
          positions.stack[5].y
        ),
        alignDeck(
          deck.slice(45, 52),
          positions.stack[6].x,
          positions.stack[6].y
        ),
      ],
    },
  };
};

/**
 * Properly aligns all the cards in a list to be displayed on the screen. This helps with treating
 * a deck of cards as a single entity when rendering rather than many different cards.
 * @param {CardModel[]} cards list of cards to be aligned
 * @param {Number} x starting x-coordinate of the bottom card
 * @param {Number} y starting y-coordinate of the bottom card
 * @param {Boolean} adjust whether the pile of cards should be staggered
 * @param {Boolean} topDown whether the top card should be face down
 * @param {Boolean} horizontal whether the cards should be staggered horizontally
 * @param {Number} scale the staggering multiplier, or how much it should move each card
 * @param {Boolean} unlimited whether the horizontal staggering should stop after 3 cards
 * @returns the list of cards with the proper positioning
 */
export const alignDeck = (
  cards,
  x,
  y,
  adjust = true,
  topDown = false,
  horizontal = false,
  scale = 1,
  unlimited = false
) => {
  for (
    let i = horizontal ? cards.length - 1 : 0;
    horizontal ? i >= 0 : i < cards.length;
    horizontal ? i-- : i++
  ) {
    if (horizontal || (i === cards.length - 1 && !topDown)) {
      if (!topDown) {
        cards[i].hidden = false;
      }
    }

    cards[i].inHand = false;

    Object.assign(cards[i].internalCard.props.position, { x: 0, y: 0 });

    if (unlimited) {
      cards[i].updateCardPosition(
        x + (horizontal ? i * 25 * scale : 0),
        y + (!horizontal && adjust ? i * 20 * scale : 0)
      );
    } else {
      cards[i].updateCardPosition(
        x + (horizontal ? ((i + 3 - (cards.length % 3)) % 3) * 25 * scale : 0),
        y + (!horizontal && adjust ? i * 20 * scale : 0)
      );
    }
  }

  return cards;
};

/**
 * Creates a list of positions for the entire game of solitaire based on the
 * client's browser siez. The math behind the numbers below is based on base card dimensions
 * from the css.
 */
export const calculatePositions = () => {
  const vw =
    Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    ) / 9;
  const vh =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) / 7;

  return {
    positions: {
      deck: { x: vw * 1.185, y: vh },
      discard: { x: vw * 2.185, y: vh },
      foundation: [
        { x: vw * 4.185, y: vh },
        { x: vw * 5.185, y: vh },
        { x: vw * 6.185, y: vh },
        { x: vw * 7.185, y: vh },
      ],
      stack: [
        { x: vw * 1.185, y: vh * 3 },
        { x: vw * 2.185, y: vh * 3 },
        { x: vw * 3.185, y: vh * 3 },
        { x: vw * 4.185, y: vh * 3 },
        { x: vw * 5.185, y: vh * 3 },
        { x: vw * 6.185, y: vh * 3 },
        { x: vw * 7.185, y: vh * 3 },
      ],
    },
    cardSize: { w: vw * 9 * 0.07, h: (vw * 9 * 0.07 * 176) / 114 },
  };
};

/**
 * Handles moving cards from the foundation piles, discard pile, and stacks to other stacks.
 * @param {Number} x x-coordinate of the stack being moved
 * @param {Number} y y-coordinate of the stack being moved
 * @param {Object} cardSize width and height of a card
 * @param {Object} gameDeck Solitaire game configuration
 * @param {String} key the stack type the cards are moving to
 * @param {String} fKey the stack type the cards are moving from
 * @param {Number} i the specific stack in a list of stacks the cards are moving to
 * @param {Number} j the specific stack in a list of stacks the cards are moving from
 * @returns whether the stack was moved
 */
export const moveToStack = (x, y, cardSize, gameDeck, key, fKey, i, j) => {
  let stack = gameDeck["stack"][fKey];
  let fromStack;
  if (key === "discard") {
    fromStack = gameDeck[key];
  } else {
    fromStack = gameDeck[key][j];
  }

  let overlap = overlapRect(
    x,
    y,
    fromStack[i].x,
    fromStack[i].y,
    cardSize.w,
    cardSize.h,
    Math.max(stack.length - 1, 0)
  );

  if (overlap > 0.5) {
    if (
      (stack.length === 0 && fromStack[i].value == 13) ||
      (stack.length !== 0 &&
        stack[stack.length - 1].color !== fromStack[i].color &&
        stack[stack.length - 1].value - 1 === fromStack[i].value)
    ) {
      stack.push(...fromStack.splice(-(fromStack.length - i)));
      return true;
    }
  }

  return false;
};

/**
 * Handles moving cards from the discard pile or the stacks to the foundation piles
 * @param {Number} x x-coordinate of the card being moved
 * @param {Number} y y-coordinate of the card being moved
 * @param {Object} cardSize width and height of a card
 * @param {Object} gameDeck Solitaire game configuration
 * @param {String} key the location the card is coming from
 * @param {String} fKey the specific foundation stack.
 * @param {Number} i if the card is coming from the stacks, this is which specific stack
 * @returns whether the card was moved to the foundation pile
 */
export const moveToFoundation = (
  x,
  y,
  cardSize,
  gameDeck,
  key,
  fKey,
  i = -1
) => {
  let card;
  let foundation = gameDeck["foundation"][fKey];
  if (i == -1) {
    card = gameDeck[key][gameDeck[key].length - 1];
  } else {
    card = gameDeck[key][i][gameDeck[key][i].length - 1];
  }

  let overlap = overlapRect(
    x,
    y,
    card.x,
    card.y,
    cardSize.w,
    cardSize.h,
    Math.max(foundation.length - 1, 0)
  );

  if (overlap > 0.5) {
    if (
      (foundation.length === 0 && card.value === 1) ||
      (foundation.length !== 0 &&
        card.value - 1 === foundation[foundation.length - 1].value &&
        foundation[foundation.length - 1].suit === card.suit)
    ) {
      foundation.push(i == -1 ? gameDeck[key].pop() : gameDeck[key][i].pop());
      return true;
    }
  }

  return false;
};

/**
 * Rotates through the deck and discard piles for Solitaire
 * @param {Object} gameDeck a Solitaire game under the same form as one created in createGame
 * @param {Number} drawCount the number of cards to be drawn
 */
export const drawCards = (gameDeck, drawCount = 3) => {
  if (gameDeck.deck.length === 0 && gameDeck.discard.length > 0) {
    gameDeck.deck = gameDeck.discard.splice(0);
    gameDeck.deck.forEach((card) => (card.hidden = true));
    gameDeck.deck.reverse();
  } else {
    let need = drawCount - gameDeck.deck.length;
    gameDeck.discard.push(...gameDeck.deck.splice(-drawCount));

    if (need > 0) {
      gameDeck.discard.push(...gameDeck.discard.splice(0, need));
    }
  }
};

/**
 * Calculates the amount of overlap between two congruent rectanges taking in their upper left most coordinates
 * and the width/height.
 *
 * @param {Number} CC the number of cards in the vertical pile
 *
 * @returns the decimal overlap of the rectangles
 */
const overlapRect = (X1, Y1, X2, Y2, W, H, CC = 0) => {
  let SI =
    Math.max(0, Math.min(X1 + W, X2 + W) - Math.max(X1, X2)) *
    Math.max(0, Math.min(Y1 + H + CC * 20, Y2 + H) - Math.max(Y1, Y2));

  return SI / (W * H * 2 - SI);
};
