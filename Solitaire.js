
import Card from './Card';
const Card = require("./Card");

const stock = [new Card(0, 'null', 'null')];
const stack1 = [new Card(0, 'null', 'null')];
const stack2 = [new Card(0, 'null', 'null')];
const stack3 = [new Card(0, 'null', 'null')];
const stack4 = [new Card(0, 'null', 'null')];
const stack5 = [new Card(0, 'null', 'null')];
const stack6 = [new Card(0, 'null', 'null')];
const stack7 = [new Card(0, 'null', 'null')];

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
    stock.slice(0,1);
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
                stock.slice(0,1);
            break;
            case 2:     //stack3
                for(let j = 0; j < 3; j++){
                    setCard(stack3);
                }
                stock.slice(0,1);
            break;
            case 3:     //stack4
                for(let j = 0; j < 4; j++){
                    setCard(stack4);
                }
                stock.slice(0,1);
            break;
            case 4:     //stack5
                for(let j = 0; j < 5; j++){
                    setCard(stack5);
                }
                stock.slice(0,1);
            break;
            case 5:     //stack6
                for(let j = 0; j < 6; j++){
                    setCard(stack6);
                }
                stock.slice(0,1);
            break;
            case 6:     //stack7
                for(let j = 0; j < 7; j++){
                    setCard(stack7);
                }
                stock.slice(0,1);
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
        console.log(`There is a ${stock[i].color} ${stock[i].value} of ${stock[i].suit}`);
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
