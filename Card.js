
class Card{

    constructor(value, suit, color) {
        this.value = value;
        this.suit = suit;
        this.color = color;
    }

    getValue() {
        return this.value;
    }

    getSuit(){
        return this.suit;
    }

    getColor(){
        return this.color;
    }
}

export default Card;
