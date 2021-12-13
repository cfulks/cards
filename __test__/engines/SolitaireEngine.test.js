import { expect, it, jest } from "@jest/globals";
import SolitaireEngine, { shuffleDeck } from "../../src/engines/SolitaireEngine";


describe("SolitaireEngine", () => {

    let solitaire;
    let orderedDeck;
    let shuffledDeck;

    beforeAll(() => {
        solitaire = new SolitaireEngine();
        orderedDeck = new SolitaireEngine.createGame();
        shuffledDeck = new SolitaireEngine.shuffledDeck(orderedDeck);
    });

    describe("Creating deck", () => {
        it("deck contains 52 cards", () => {
            expect(orderedDeck.deck.length()).toBe(52);
        });
        it("first card in deck is Ace of Hearts", () => {
            expect(orderedDeck.deck[0].value).toBe(1);
            expect(orderedDeck.deck[0].suit).toBe('hearts');
            expect(orderedDeck.deck[0].color).toBe('Red');
        });
        it("last card in deck is 13 of clubs", ()=> {
            expect(orderedDeck.deck[0].value).toBe(13);
            expect(orderedDeck.deck[0].suit).toBe('clubs');
            expect(orderedDeck.deck[0].color).toBe('Black');
        });
        it("deck is built in order", ()=>{
            let deck = [];
            for (let i = 0; i < 13; i++) {
                deck.push({ value: i + 1, suit: "hearts", color: "Red" });
                deck.push({ value: i + 1, suit: "diamonds", color: "Red" });
                deck.push({ value: i + 1, suit: "spades", color: "Black" });
                deck.push({ value: i + 1, suit: "clubs", color: "Black" });
            }

            for(let i = 0; i < deck.length; i++){
                if(i % 4 === 0){
                    expect(orderedDeck.deck[i].suit).toBe('hearts');
                    expect(orderedDeck.deck[i].color).toBe('Red');
                }else if(i % 4 === 1){
                    expect(orderedDeck.deck[i].suit).toBe('diamonds');
                    expect(orderedDeck.deck[i].color).toBe('Red');
                }else if(i % 4 === 2){
                    expect(orderedDeck.deck[i].suit).toBe('spades');
                    expect(orderedDeck.deck[i].color).toBe('Black');
                }else if(i % 4 === 3){
                    expect(orderedDeck.deck[i].suit).toBe('clubs');
                    expect(orderedDeck.deck[i].color).toBe('Black');
                }

                if(i % 13 === 9 || i % 13 === 10 || i % 13 === 11 || i % 13 === 12){
                    expect(orderedDeck.deck[i].value).toBe(10);
                }else{
                    expect(orderedDeck.deck[i].value).toBe((i%13)+1);
                }
            }
        });
    });

    describe("Shuffled Deck", () => {
        it("An ordered deck was passed as the argument", () => {
            expect(shuffledDeck).toHaveBeenCalledWith(orderedDeck);
        });
        it("The deck has been shuffled at least once", () => {
            shuffleDeck(orderedDeck);
            let orderCards = 0;
            for(let i = 0; i < 13; i++){
                if(orderedDeck[i].value === (orderedDeck[i+1].value - 1)){
                    orderCards++;
                }
            }
            expect(orderCards).not.toBe(13);
        });
        it("Deck size doesn't change after shuffle", () => {
            expect(orderedDeck.length).toBe(52);
        });
        it("A small deck to be shuffled", () => {
            let deck = [{value: 1, value: 41, value: 11, value: 52, value:6, value: 32}];
            shuffleDeck(deck);
            expect(deck.length).toBe(6);
        });
        it("Allow shuffling of a NaN deck", () => {
            let deck = [{value: 'a', value: 'b', value: 'c'}];
            expect(shuffleDeck(deck)).not.toThrow();
            shuffleDeck(deck);
            expect(deck.length).toBe(3);
        });
        it("All elements retain value after shuffle", () => {
            let deck = [{value: 1, value: 2, value: 3, value: 4, value:5, value: 6}];
            shuffleDeck(deck);
            expect(deck).toEqual(expect.arrayContaining(deck));
        });
    });
});
