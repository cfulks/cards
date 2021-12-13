import { expect, it, jest } from "@jest/globals";
import BlackjackEngine, {Game} from "../../src/engines/BlackjackEngine";


describe("BlackjackEngine", () =>{
    let game;
    let blackJackEngine;

    beforeAll(() => {
        game = new Game();
        blackJackEngine = new BlackjackEngine();
        //blackJackEngine.build();
    });

    describe("CalculatingCardValue", () =>{
        it("calculating 2 aces and a 9", () => {
            let hand = [{value: 1, value: 1, value: 9}];
            expect(game.calculateCardValue(hand)).toBe(21);
        });
        it("calculating 0 cards", () => {
            let hand = [];
            expect(game.calculateCardValue(hand)).toBe(0);
        });
        it("Calculating too many aces and cards", () =>{
            let hand = [{value: 1, value: 1, value: 1, value: 1, value: 1, value: 1,value: 1, value: 1,value: 1, value: 1,
                value: 1, value: 1,value: 1, value: 1, value: 1, value: 1,value: 1, value: 1,value: 1, value: 1, }];
            expect(game.calculateCardValue(hand)).toBe(20);
        });
        it("calculating simple hand 5 & 8", () => {
            let hand = [{value: 5, value: 8}];
            expect(game.calculateCardValue(hand)).toBe(13);
        });
        it("calculating 1 card", () => {
            let hand = [{value: 7}];
            expect(game.calculateCardValue(hand)).toBe(7);
        });
        it("calculating null hand", () =>{
            let hand = null;
            expect(game.calculateCardValue(hand)).toBeNull();
        });
        it("calculating two face cards", () => {
            let hand = [{value: 11, value: 13}];
            expect(game.calculateCardValue(hand)).toBe(20);
        });
        it("calculating throws an error when inputing chars", () => {
            let hand = [{value:'a', value:'&',value:'-'}];
            expect(game.calculateCardValue(hand)).toThrow();
        });
        //this should add negative numbers
        it("calculating negative and zero numbers",() => {
            let hand = [{value: -2, value: -1, vlaue:0}];
            expect(game.calculateCardValue(hand)).toBe(-3);
        });
    });

    describe("DrawCard", () => {

    });

    describe("Build deck", () => {
        it("deck contains 52 cards", () => {
            expect(blackJackEngine.deck.length()).toBe(52);
        });
        it("first card in deck is Ace of Hearts", () => {
            expect(blackJackEngine.deck[0].value).toBe(1);
            expect(blackJackEngine.deck[0].suit).toBe('hearts');
            expect(blackJackEngine.deck[0].color).toBe('Red');
        });
        it("last card in deck is 13 of clubs", ()=> {
            expect(blackJackEngine.deck[0].value).toBe(13);
            expect(blackJackEngine.deck[0].suit).toBe('clubs');
            expect(blackJackEngine.deck[0].color).toBe('Black');
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
                    expect(blackJackEngine.deck[i].suit).toBe('hearts');
                    expect(blackJackEngine.deck[i].color).toBe('Red');
                }else if(i % 4 === 1){
                    expect(blackJackEngine.deck[i].suit).toBe('diamonds');
                    expect(blackJackEngine.deck[i].color).toBe('Red');
                }else if(i % 4 === 2){
                    expect(blackJackEngine.deck[i].suit).toBe('spades');
                    expect(blackJackEngine.deck[i].color).toBe('Black');
                }else if(i % 4 === 3){
                    expect(blackJackEngine.deck[i].suit).toBe('clubs');
                    expect(blackJackEngine.deck[i].color).toBe('Black');
                }

                if(i % 13 === 9 || i % 13 === 10 || i % 13 === 11 || i % 13 === 12){
                    expect(blackJackEngine.deck[i].value).toBe(10);
                }else{
                    expect(blackJackEngine.deck[i].value).toBe((i%13)+1);
                }
            }
        });

    });

});
