import Card from "../models/CardModel.js";

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

const shuffleDeck = (deck) => {
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

export const createGame = () => {
  let deck = [];
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 4; j++) {
      switch (j) {
        case 0:
          deck.push(new Card(i + 1, conversions[i], "hearts", "Red"));
          break;
        case 1:
          deck.push(new Card(i + 1, conversions[i], "diamonds", "Red"));
          break;
        case 2:
          deck.push(new Card(i + 1, conversions[i], "spades", "Black"));
          break;
        case 3:
          deck.push(new Card(i + 1, conversions[i], "clubs", "Black"));
          break;
        default:
          console.log("Suit Error");
          break;
      }
    }
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

export const alignDeck = (
  cards,
  x,
  y,
  adjust = true,
  topDown = false,
  horizontal = false
) => {
  for (
    let i = horizontal ? cards.length - 1 : 0;
    horizontal ? i >= 0 : i < cards.length;
    horizontal ? i-- : i++
  ) {
    if (horizontal || (i === cards.length - 1 && !topDown)) {
      cards[i].hidden = false;
    }

    cards[i].inHand = false;

    Object.assign(cards[i].internalCard.props.position, { x: 0, y: 0 });
    cards[i].updateCardPosition(
      x + (horizontal ? ((i + 3 - (cards.length % 3)) % 3) * 25 : 0),
      y + (!horizontal && adjust ? i * 20 : 0)
    );
  }

  return cards;
};

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

// This needs to keep order but it doesn't
// Align Deck: Draw cards only returns 2 if the first hand is drawn from
export const drawCards = (gameDeck) => {
  if (gameDeck.deck.length === 0 && gameDeck.discard.length > 0) {
    gameDeck.deck = gameDeck.discard.splice(0);
    gameDeck.deck.forEach((card) => (card.hidden = true));
    gameDeck.deck.reverse();
  } else {
    let need = 3 - gameDeck.deck.length;
    gameDeck.discard.push(...gameDeck.deck.splice(-3));

    if (need > 0) {
      gameDeck.discard.push(...gameDeck.discard.splice(0, need));
    }
  }
};

const overlapRect = (X1, Y1, X2, Y2, W, H, CC = 0) => {
  let SI =
    Math.max(0, Math.min(X1 + W, X2 + W) - Math.max(X1, X2)) *
    Math.max(0, Math.min(Y1 + H + CC * 20, Y2 + H) - Math.max(Y1, Y2));

  return SI / (W * H * 2 - SI);
};
