import React from "react";
import ReactDOM from "react-dom";
import {
  createGame,
  alignDeck,
  calculatePositions,
  moveToStack,
  moveToFoundation,
  drawCards,
} from "../../models/CardDeckModel.js";

import Card from "./Card.jsx";

class Solitaire extends React.Component {
  timer;

  constructor() {
    super();

    this.state = {
      x: 0,
      y: 0,
      moves: 0,
    };

    let settings = createGame();

    this.gameDeck = settings.gameDeck;
    this.positions = settings.positions;
    this.cardSize = settings.cardSize;

    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeHandler);
    this.stopwatch();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeHandler);
  }

  resizeHandler() {
    let a = calculatePositions();
    this.positions = a.positions;
    this.cardSize = a.cardSize;
    this._onMouseUp();
  }

  stopwatch() {
    const clock = document.getElementById("display");
    let start = Date.now(),
      intervalId;
    function incrementTime() {
      let time = Math.floor((Date.now() - start) / 1000);
      clock.textContent =
        ("0" + Math.trunc(time / 60)).slice(-2) +
        ":" +
        ("0" + (time % 60)).slice(-2);
    }
    incrementTime();
    intervalId = setInterval(incrementTime, 1000);
  }

  _onMouseUp() {
    out: for (let key in this.gameDeck) {
      if (key === "stack") {
        for (let i = 0; i < this.gameDeck[key].length; i++) {
          for (let j = this.gameDeck[key][i].length - 1; j >= 0; j--) {
            if (this.gameDeck[key][i][j].inHand) {
              for (let positionKey in this.positions) {
                if (
                  positionKey === "foundation" &&
                  j == this.gameDeck[key][i].length - 1
                ) {
                  for (let k = 0; k < this.positions[positionKey].length; k++) {
                    if (
                      moveToFoundation(
                        this.positions[positionKey][k].x,
                        this.positions[positionKey][k].y,
                        this.cardSize,
                        this.gameDeck,
                        key,
                        k,
                        i
                      )
                    ) {
                      break out;
                    }
                  }
                } else if (positionKey === "stack") {
                  for (let k = 0; k < this.positions[positionKey].length; k++) {
                    if (
                      moveToStack(
                        this.positions[positionKey][k].x,
                        this.positions[positionKey][k].y,
                        this.cardSize,
                        this.gameDeck,
                        key,
                        k,
                        j,
                        i
                      )
                    ) {
                      break out;
                    }
                  }
                }
              }
              break out;
            }
          }
        }
      } else if (key === "deck") {
        if (
          this.state.x > this.positions.deck.x &&
          this.state.x < this.positions.deck.x + this.cardSize.w &&
          this.state.y > this.positions.deck.y &&
          this.state.y < this.positions.deck.y + this.cardSize.h
        ) {
          drawCards(this.gameDeck);
          break out;
        }
      } else if (key === "foundation") {
        for (let i = 0; i < this.gameDeck[key].length; i++) {
          if (
            this.gameDeck[key][i].length > 0 &&
            this.gameDeck[key][i][this.gameDeck[key][i].length - 1].inHand
          ) {
            for (let k = 0; k < this.positions.foundation.length; k++) {
              if (
                moveToFoundation(
                  this.positions.foundation[k].x,
                  this.positions.foundation[k].y,
                  this.cardSize,
                  this.gameDeck,
                  key,
                  k
                )
              ) {
                break out;
              }
            }
            for (let k = 0; k < this.positions.stack.length; k++) {
              if (
                moveToStack(
                  this.positions.stack[k].x,
                  this.positions.stack[k].y,
                  this.cardSize,
                  this.gameDeck,
                  key,
                  k,
                  this.gameDeck[key][i].length - 1,
                  i
                )
              ) {
                break out;
              }
            }
          }
        }
      } else if (key === "discard") {
        if (
          this.gameDeck[key].length > 0 &&
          this.gameDeck[key][this.gameDeck[key].length - 1].inHand
        ) {
          for (let k = 0; k < this.positions.foundation.length; k++) {
            if (
              moveToFoundation(
                this.positions.foundation[k].x,
                this.positions.foundation[k].y,
                this.cardSize,
                this.gameDeck,
                key,
                k
              )
            ) {
              break out;
            }
          }
          for (let k = 0; k < this.positions.stack.length; k++) {
            if (
              moveToStack(
                this.positions.stack[k].x,
                this.positions.stack[k].y,
                this.cardSize,
                this.gameDeck,
                key,
                k,
                this.gameDeck[key].length - 1
              )
            ) {
              break out;
            }
          }
        }
      }
    }

    for (let key in this.gameDeck) {
      if (key !== "deck" && key !== "discard") {
        for (let i = 0; i < this.gameDeck[key].length; i++) {
          alignDeck(
            this.gameDeck[key][i],
            this.positions[key][i].x,
            this.positions[key][i].y,
            key !== "foundation"
          );
        }
      } else {
        alignDeck(
          this.gameDeck[key],
          this.positions[key].x,
          this.positions[key].y,
          false,
          key === "deck",
          key === "discard"
        );
      }
    }

    this.forceUpdate();
  }

  _onMouseMove(e) {
    this.setState({
      x: e.clientX,
      y: e.clientY - document.getElementsByClassName("topbar")[0].clientHeight,
    });

    for (let key in this.gameDeck) {
      if (key !== "deck" && key !== "discard") {
        for (let stack of this.gameDeck[key]) {
          for (let i = stack.length - 1; i >= 0; i--) {
            if (!stack[i].hidden && stack[i].inHand) {
              if (key === "stack") {
                for (let j = i; j < stack.length; j++) {
                  stack[j].updateCardPosition(
                    e.clientX - this.state.x,
                    e.clientY -
                      document.getElementsByClassName("topbar")[0]
                        .clientHeight -
                      this.state.y
                  );
                }
              } else {
                stack[i].updateCardPosition(
                  e.clientX - this.state.x,
                  e.clientY -
                    document.getElementsByClassName("topbar")[0].clientHeight -
                    this.state.y
                );
              }
              break;
            }
          }
        }
      } else if (key === "discard") {
        if (
          this.gameDeck[key].length > 0 &&
          this.gameDeck[key][this.gameDeck[key].length - 1].inHand
        ) {
          this.gameDeck[key][this.gameDeck[key].length - 1].updateCardPosition(
            e.clientX - this.state.x,
            e.clientY -
              document.getElementsByClassName("topbar")[0].clientHeight -
              this.state.y
          );
        }
      }
    }
  }

  render() {
    return (
      <div
        id="game"
        onMouseMove={this._onMouseMove.bind(this)}
        onMouseUp={this._onMouseUp.bind(this)}
      >
        <div className="topbar">
          <div className="stopwatch">
            <label>Timer</label>
            <span className="time" id="display">
              00:00
            </span>
          </div>
          <div className="score">
            <label>Score</label>
            <span>0</span>
          </div>
          <div className="moves">
            <label>Moves</label>
            <span>0</span>
          </div>
        </div>
        <div className="board">
          {this.gameDeck.deck.length == 0 ? (
            <Card
              blank
              value="0"
              position={{ x: this.positions.deck.x, y: this.positions.deck.y }}
            />
          ) : (
            this.gameDeck.deck.map(cm)
          )}
          {this.gameDeck.discard.length == 0 ? (
            <Card
              blank
              value="1"
              position={{
                x: this.positions.discard.x,
                y: this.positions.discard.y,
              }}
            />
          ) : (
            this.gameDeck.discard.slice(-3).map(cm)
          )}
          {this.gameDeck.foundation[0].length == 0 ? (
            <Card
              blank
              value="2"
              position={{
                x: this.positions.foundation[0].x,
                y: this.positions.foundation[0].y,
              }}
            />
          ) : (
            this.gameDeck.foundation[0].map(cm)
          )}
          {this.gameDeck.foundation[1].length == 0 ? (
            <Card
              blank
              value="3"
              position={{
                x: this.positions.foundation[1].x,
                y: this.positions.foundation[1].y,
              }}
            />
          ) : (
            this.gameDeck.foundation[1].map(cm)
          )}
          {this.gameDeck.foundation[2].length == 0 ? (
            <Card
              blank
              value="4"
              position={{
                x: this.positions.foundation[2].x,
                y: this.positions.foundation[2].y,
              }}
            />
          ) : (
            this.gameDeck.foundation[2].map(cm)
          )}
          {this.gameDeck.foundation[3].length == 0 ? (
            <Card
              blank
              value="5"
              position={{
                x: this.positions.foundation[3].x,
                y: this.positions.foundation[3].y,
              }}
            />
          ) : (
            this.gameDeck.foundation[3].map(cm)
          )}
          {this.gameDeck.stack[0].length == 0 ? (
            <Card
              blank
              value="6"
              position={{
                x: this.positions.stack[0].x,
                y: this.positions.stack[0].y,
              }}
            />
          ) : (
            this.gameDeck.stack[0].map(cm)
          )}
          {this.gameDeck.stack[1].length == 0 ? (
            <Card
              blank
              value="7"
              position={{
                x: this.positions.stack[1].x,
                y: this.positions.stack[1].y,
              }}
            />
          ) : (
            this.gameDeck.stack[1].map(cm)
          )}
          {this.gameDeck.stack[2].length == 0 ? (
            <Card
              blank
              value="8"
              position={{
                x: this.positions.stack[2].x,
                y: this.positions.stack[2].y,
              }}
            />
          ) : (
            this.gameDeck.stack[2].map(cm)
          )}
          {this.gameDeck.stack[3].length == 0 ? (
            <Card
              blank
              value="9"
              position={{
                x: this.positions.stack[3].x,
                y: this.positions.stack[3].y,
              }}
            />
          ) : (
            this.gameDeck.stack[3].map(cm)
          )}
          {this.gameDeck.stack[4].length == 0 ? (
            <Card
              blank
              value="10"
              position={{
                x: this.positions.stack[4].x,
                y: this.positions.stack[4].y,
              }}
            />
          ) : (
            this.gameDeck.stack[4].map(cm)
          )}
          {this.gameDeck.stack[5].length == 0 ? (
            <Card
              blank
              value="11"
              position={{
                x: this.positions.stack[5].x,
                y: this.positions.stack[5].y,
              }}
            />
          ) : (
            this.gameDeck.stack[5].map(cm)
          )}
          {this.gameDeck.stack[6].length == 0 ? (
            <Card
              blank
              value="12"
              position={{
                x: this.positions.stack[6].x,
                y: this.positions.stack[6].y,
              }}
            />
          ) : (
            this.gameDeck.stack[6].map(cm)
          )}
        </div>
      </div>
    );
  }
}

const cm = (card) => card.internalCard;

ReactDOM.render(<Solitaire />, document.getElementById("main"));
