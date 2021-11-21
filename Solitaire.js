
import Card from './Card';
const Card = require("./Card");

const stock = [];
const stack1 = [];
const stack2 = [];
const stack3 = [];
const stack4 = [];
const stack5 = [];
const stack6 = [];
const stack7 = [];


const createDeck = () =>{
    for(let i = 1; i < 14; i++){
        for(let j = 0; j < 4; j++){
            switch(j){
                case 0:
                    stock.push(new Card(i, 'Hearts', 'Red'));
                break;
                case 1:
                    stock.push(new Card(i, 'Diamonds', 'Red'));
                break;
                case 2:
                    stock.push(new Card(i, 'Spades', 'Black'));
                break;
                case 3:
                    stock.push(new Card(i, 'Clubs', 'Black'));
                break;
                default:
                console.log("Suit Error");
                break;
            }
        }
    }
}

const shuffleDeck = () => {
    for(let i = 0; i < stock.length; i ++){
        let randIndex = i + Math.randomIndex(stock);
        if(randIndex == stock.length){
            continue;
        }
        
        let temp = stock[randIndex];
        stock[randIndex] = stock[i];
        stock[i] = temp;
    }
}

const setStacks = () => {
    for(let i = 0; i < 7; i++){
        switch(i){
            case 0:     //stack1
                setCard(stack1);
            break;
            case 1:     //stack2
                for(let j = 0; j < 2; j++){
                    setCard(stack2);
                }
            break;
            case 2:     //stack3
                for(let j = 0; j < 3; j++){
                    setCard(stack3);
                }
            break;
            case 3:     //stack4
                for(let j = 0; j < 4; j++){
                    setCard(stack4);
                }
            break;
            case 4:     //stack5
                for(let j = 0; j < 5; j++){
                    setCard(stack5);
                }
            break;
            case 5:     //stack6
                for(let j = 0; j < 6; j++){
                    setCard(stack6);
                }
            break;
            case 6:     //stack7
                for(let j = 0; j < 7; j++){
                    setCard(stack7);
                }
            break;
            default:
                console.log("Error making stacks");
            break;
        }
    }
}

const setCard = (stack) => {
    if(stock[0] != null){
        stack.push(stock[0]);
        stock.splice(0,1);
    }
}


const printCardsInStock = () =>{
    console.log(`There are ${stock.length} cards in the deck`);
    
    for(let i = 0; i < stock.length; i++){
        console.log(stock[i].value);
    }
    console.log();
}

const setUp = () =>{

    createDeck();

    for(let i = 0; i < 6; i++){
        shuffleDeck();
    }

    setStacks();

    //printCardsInStacks();
}

export default Solitare;
