# cards

Capstone Project for CSCE-361

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
