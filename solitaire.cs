using System;
using System.Collections.Generic;

namespace CardGames{
    public class solitaire
    {

        public List<Card> deck = new List<Card>();

        public void SetUp(){
            
            CreateDeck();

            //Giving it a good shuffle
            for(int i = 0; i < 6; i++)
                ShuffleDeck();
           
           //print deck
            //for(int i = 0; i < deck.Count; i++){
            //    Console.WriteLine("Card " + i + " value = " + deck[i].value + " suit = " + deck[i].suit + " color = " + deck[i].color);
            //}
        }

        private void CreateDeck()
        {
            for(int i = 1; i < 14; i++)
            {
                for(int j = 0; j < 4; j++)
                {
                    switch(j){
                        case 0:     //Hearts
                        deck.Add(new Card(i, Card.Suit.Hearts, Card.Color.Red));
                        break;
                        case 1:     //Diamonds
                        deck.Add(new Card(i, Card.Suit.Diamonds, Card.Color.Red));
                        break;
                        case 2:     //Spades
                        deck.Add(new Card(i, Card.Suit.Spades, Card.Color.Black));
                        break;
                        case 3:     //Club
                        deck.Add(new Card(i, Card.Suit.Clubs, Card.Color.Black));
                        break;
                    }
                }
            }
        }

        private void ShuffleDeck()
        {
            Random random = new Random();
            for(int i = 0; i < deck.Count; i++){
                int randIndex = i + random.Next(deck.Count - i);
                //making sure index doesn't go out of list bounds
                if(randIndex == deck.Count)
                    continue;
                Card temp = deck[randIndex];
                deck[randIndex] = deck[i];
                deck[i] = temp;
            }
        }

    }
}
