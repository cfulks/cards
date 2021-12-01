let deck = [2,3,4,5,6,7,8,9,10,10,10,11,
            2,3,4,5,6,7,8,9,10,10,10,11,
            2,3,4,5,6,7,8,9,10,10,10,11,
            2,3,4,5,6,7,8,9,10,10,10,11]


let playerHand = [];
let dealerHand = [];
let numberOfPlayer = 6 ;

//Return card from deck randomly
function drawRandomCard(deck)
{
    let randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
}

//console.log(drawRandomCard(deck));

//finding the sum of a hand
function getHandValue(hand)
{
  let sum = 0;
  for (let i = 0 ; i<hand.length ; i++)
  {
    sum = sum + hand[i];
  }
  return sum;
}


function startGame(){
  for (let i = 1 ; i <=numberOfPlayer ; i++)
  {
    playerHand = [drawRandomCard(deck), drawRandomCard(deck)];
    console.log("Player " + i + " hand is : " + playerHand + 
     "| whose sum is ==" + getHandValue(playerHand));
  }
  dealerHand = [drawRandomCard(deck), drawRandomCard(deck)];
  console.log("Dealer Hand is : " + dealerHand + "| has a sum of " + 
  getHandValue(dealerHand));
}

function hit()
{
  playerHand.push(drawRandomCard(deck));
  if(getHandValue(playerHand) > 21){
    console.log("You lose");
  }
  
}



startGame();

