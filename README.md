# cards

Capstone Project for CSCE-361

## Card Games Development
For our capstone project, we implemented two card games that use the standard 52-card pack: Solitaire and Blackjack. The technologies used in this project are HTML, CSS, JavaScript, React, and Socket.io. Tests were also written for this project to test functionality and ensure there are no lingering bugs. 

To run the project locally, clone the git repo into a working directory of choice or download the .zip files. 

## Setup

To download the dependencies:

```
npm install
```

To run the server:

```
npm start
```

To run the tests:

```
npm test
```

## Development

Development should be done with the following command to help with debugging

```
npm run start:dev
```

## Notes

It is important to note that the socket.io server that runs with `npm start` is one port higher than the express server. Defaults are 8000 for the express server and 8001 for socket.io

<hr>

# Solitaire
![image](https://github.com/cfulks73/cards/blob/master/docs/solitaire.png)

Some of the functionalities in Solitaire include a stopwatch, a scoreboard, and a moves count. The design of the game is simple and users can click and drag cards around the screen. Clicking the draw pile will draw 3 cards at once. Users can place their aces in whichever of the four winning piles as they choose. 

# Multiplayer
For Blackjack, we implemented a multiplayer game that allows players to set up their own private game using a passcode. When players decide to play blackjack, they will encounter a menu. 

![image](https://github.com/cfulks73/cards/blob/master/docs/join.png)

Below is the menu after clicking the 'Create a new game' prompt:

![image](https://github.com/cfulks73/cards/blob/master/docs/create.png)

Below is the menu after clicking the 'Join game by code' prompt:

![image](https://github.com/cfulks73/cards/blob/master/docs/code.png)

If users choose not to play on a private server, the main server is available to join. Below is the confirmation menu after users click the 'Join main room' prompt:

![image](https://github.com/cfulks73/cards/blob/master/docs/main.png)

# Blackjack
![image](https://github.com/cfulks73/cards/blob/master/docs/blackjack.png)

In Blackjack, users have a bank menu in which they can make bets by clicking on the pokerchips. Users can also choose game options such as 'Hit', 'Stand', and 'Double X2' where they can double down on their bets. Users can only see their own cards and one of the dealer's cards, other users' cards are hidden and users only know how many other users there are as well as the bets made by other users. 
 
![image](https://github.com/cfulks73/cards/blob/master/docs/blackjack2.png)

The bank menu can be minimized by clicking on it. 

