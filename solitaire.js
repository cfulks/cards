
import Card from './Card.js';

let stock = [new Card(0, 'null', 'null')];
let stack1 = [new Card(0, 'null', 'null')];
let stack2 = [new Card(0, 'null', 'null')];
let stack3 = [new Card(0, 'null', 'null')];
let stack4 = [new Card(0, 'null', 'null')];
let stack5 = [new Card(0, 'null', 'null')];
let stack6 = [new Card(0, 'null', 'null')];
let stack7 = [new Card(0, 'null', 'null')];

let discard = [new Card(0, 'null', 'null')];
let ace1 = [new Card(0, 'null', 'null')];
let ace2 = [new Card(0, 'null', 'null')];
let ace3 = [new Card(0, 'null', 'null')];
let ace4 = [new Card(0, 'null', 'null')];

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
  stock = stock.slice(1, (stock.length));
}

const shuffleDeck = () => {
	for(let i = 0; i < stock.length; i ++){
        let randIndex = Math.floor(Math.random()*stock.length);
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
		stack1 = stack1.slice(1,stack1.length);
            break;
            case 1:     //stack2
                for(let j = 0; j < 2; j++){
                    setCard(stack2);
                }
                stack2 = stack2.slice(1, stack2.length);
            break;
            case 2:     //stack3
                for(let j = 0; j < 3; j++){
                    setCard(stack3);
                }
                stack3 = stack3.slice(1, stack3.length);
            break;
            case 3:     //stack4
                for(let j = 0; j < 4; j++){
                    setCard(stack4);
                }
                stack4 = stack4.slice(1, stack4.length);
            break;
            case 4:     //stack5
                for(let j = 0; j < 5; j++){
                    setCard(stack5);
                }
                stack5 = stack5.slice(1, stack5.length);
            break;
            case 5:     //stack6
                for(let j = 0; j < 6; j++){
                    setCard(stack6);
                }
                stack6 = stack6.slice(1, stack6.length);
            break;
            case 6:     //stack7
                for(let j = 0; j < 7; j++){
                    setCard(stack7);
                }
                stack7 = stack7.slice(1, stack7.length);
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

const reshuffle = (stock, discard) => {
    for(let i = 0; i < discard.length; i++) {
        temp = discard.pop();
        stock.push(temp);
    }
}

const printCardsInDiscard = () => {
    console.log(`There are ${discard.length} cards in the discard pile`);

    for(let i = 0; i < discard.length; i++) {
        console.log(`There is a ${discard[i].color} ${discard[i].value} of ${discard[i].suit}`);
    }
    console.log();
}


const printCardsInStock = () =>{
    console.log(`There are ${stock.length} cards in the deck`);
    
    for(let i = 0; i < stock.length; i++){
        console.log(`There is a ${stock[i].color} ${stock[i].value} of ${stock[i].suit}`);
    }
    console.log();
}

const printCardsInStacks = () => {
	console.log(`There are ${stack1.length} cards in stack 1`);
	for(let i = 0; i < stack1.length; i++){
		console.log(`In stack 1 there is a ${stack1[i].color} ${stack1[i].value} of ${stack1[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack2.length} cards in stack 2`);
    console.log();

    for(let i = 0; i < stack2.length; i++){
		console.log(`In stack 2 there is a ${stack2[i].color} ${stack2[i].value} of ${stack2[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack3.length} cards in stack 3`);
    console.log();

    for(let i = 0; i < stack3.length; i++){
		console.log(`In stack 3 there is a ${stack3[i].color} ${stack3[i].value} of ${stack3[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack4.length} cards in stack 4`);
    console.log();

    for(let i = 0; i < stack4.length; i++){
		console.log(`In stack 4 there is a ${stack4[i].color} ${stack4[i].value} of ${stack4[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack5.length} cards in stack 5`);
    console.log();

    for(let i = 0; i < stack5.length; i++){
		console.log(`In stack 5 there is a ${stack5[i].color} ${stack5[i].value} of ${stack5[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack6.length} cards in stack 6`);
    console.log();

    for(let i = 0; i < stack6.length; i++){
		console.log(`In stack 6 there is a ${stack6[i].color} ${stack6[i].value} of ${stack6[i].suit}.`);
	}
    console.log();
    console.log(`There are ${stack7.length} cards in stack 7`);
    console.log();

    for(let i = 0; i < stack7.length; i++){
		console.log(`In stack 7 there is a ${stack7[i].color} ${stack7[i].value} of ${stack7[i].suit}.`);
	}
    console.log();
    //this is actually disgusting
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
