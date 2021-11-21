
import Card from './Card';
const Card = require("./Card");

const stock = [];
const stacks = [[],[],[],[],[],[],[]];


const createDeck = () =>{
    for(let i = 0; i < 14; i++){
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
    for(let i = 0; i < stacks.length; i++){
        switch(i){
            case 0:
                for(let j = 0; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 1:
                for(let j = 1; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 2:
                for(let j = 2; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 3:
                for(let j = 3; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 4:
                for(let j = 4; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 5:
                for(let j = 5; j < stacks.length; j++){
                    setCard(stacks[j]);
                }
            break;
            case 6:
                for(let j = 6; j < stacks.length; j++){
                    setCard(stacks[j]);
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

const printCardsInStacks = () => {
    for(let i = 0; i < stacks.length; i++){
        console.log("There are " + stacks[i].length + " cards in stack" + i);
        for(let j = 0; j < stacks[i].length; j++){
            console.log("In stack " + i + " there is a " + stacks[i].color + " " + stacks[i][j].value + " of " + stacks[i][j].suit + ".");
        }
        console.log();
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

    //printCardsInStock();
    //printCardsInStacks();
}

export default Solitare;
