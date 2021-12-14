import { expect, it, jest } from "@jest/globals";
import BlackjackEngine, {Game} from "../../src/engines/BlackjackEngine";


describe("BlackjackEngine", () =>{
    let game;
    //let blackJackEngine;

    beforeAll(() => {
        game = new Game();
        //blackJackEngine = new BlackjackEngine();
        BlackjackEngine.build();
    });

    describe("CalculatingCardValue", () =>{
        it("calculating 2 aces and a 9", () => {
            let hand = [{value: 1, value: 1, value: 9}];
            expect(game.calculateCardValue(hand)).toEqual(21);
        });
        it("calculating 0 cards", () => {
            let hand = [];
            expect(game.calculateCardValue(hand)).toEqual(0);
        });
        it("Calculating too many aces and cards", () =>{
            let hand = [{value: 1, value: 1, value: 1, value: 1, value: 1, value: 1,value: 1, value: 1,value: 1, value: 1,
                value: 1, value: 1,value: 1, value: 1, value: 1, value: 1,value: 1, value: 1,value: 1, value: 1, }];
            expect(game.calculateCardValue(hand)).toEqual(20);
        });
        it("calculating simple hand 5 & 8", () => {
            let hand = [{value: 5, value: 8}];
            expect(game.calculateCardValue(hand)).toEqual(13);
        });
        it("calculating 1 card", () => {
            let hand = [{value: 7}];
            expect(game.calculateCardValue(hand)).toEqual(7);
        });
        it("calculating null hand to be 0", () =>{
            let hand = null;
            expect(game.calculateCardValue(hand)).toEqual(0);
        });
        it("calculating two face cards", () => {
            let hand = [{value: 11, value: 13}];
            expect(game.calculateCardValue(hand)).toEqual(20);
        });
        it("calculating is NaN when inputing chars", () => {
            let hand = [{value:'a', value:'&',value:'-'}];
            expect(game.calculateCardValue(hand)).not.toBeNaN();
        });
        //this should add negative numbers
        it("calculating negative and zero numbers",() => {
            let hand = [{value: -2, value: -1, vlaue:0}];
            expect(game.calculateCardValue(hand)).toEqual(-3);
        });
    });

    describe("DrawCard", () => {

    });

    describe("Build deck", () => {
        it("deck contains 52 cards", () => {
            expect(BlackjackEngine.deck.length).toEqual(52);
        });
        it("first card in deck is Ace of Hearts", () => {
            expect(BlackjackEngine.deck[0].value).toEqual(1);
            expect(BlackjackEngine.deck[0].suit).toEqual('hearts');
            expect(BlackjackEngine.deck[0].color).toEqual('Red');
        });
        it("last card in deck is 13 of clubs", ()=> {
            expect(BlackjackEngine.deck[51].value).toEqual(13);
            expect(BlackjackEngine.deck[51].suit).toEqual('clubs');
            expect(BlackjackEngine.deck[51].color).toEqual('Black');
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
                    expect(BlackjackEngine.deck[i].suit).toEqual('hearts');
                    expect(BlackjackEngine.deck[i].color).toEqual('Red');
                }else if(i % 4 === 1){
                    expect(BlackjackEngine.deck[i].suit).toEqual('diamonds');
                    expect(BlackjackEngine.deck[i].color).toEqual('Red');
                }else if(i % 4 === 2){
                    expect(BlackjackEngine.deck[i].suit).toEqual('spades');
                    expect(BlackjackEngine.deck[i].color).toEqual('Black');
                }else if(i % 4 === 3){
                    expect(BlackjackEngine.deck[i].suit).toEqual('clubs');
                    expect(BlackjackEngine.deck[i].color).toEqual('Black');
                }

                if(i % 13 === 9 || i % 13 === 10 || i % 13 === 11 || i % 13 === 12){
                    expect(BlackjackEngine.deck[i].value).toEqual(10);
                }else{
                    expect(BlackjackEngine.deck[i].value).toEqual((i%13) + 1);
                }
            }
        });

    });

});
