using System;
using System.Collections.Generic;

public class Card
{
    public enum Color{
        Red, Black
    }

    public enum Suit{
        Hearts, Diamonds, Spades, Clubs
    }

    public int value;
    public Suit suit;
    public Color color;

    public Card(int value, Suit suit, Color color){
        this.value = value;
        this.suit = suit;
        this.color = color;
    }

}