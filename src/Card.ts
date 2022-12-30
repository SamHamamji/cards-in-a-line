enum CARD_SYMBOL { SPADES, HEARTS, CLUBS, DIAMONDS }

const cardSymbolIcon = {
    [CARD_SYMBOL.SPADES]: "♠",
    [CARD_SYMBOL.HEARTS]: "♥",
    [CARD_SYMBOL.CLUBS]: "♣",
    [CARD_SYMBOL.DIAMONDS]: "♦",
};

class Card {
    public value: number;
    public type: CARD_SYMBOL;

    constructor(value: number, type: CARD_SYMBOL) {
        this.value = value;
        this.type = type;
    }

    public toString(): string {
        return this.value.toString().padStart(2, "0") + cardSymbolIcon[this.type];
    }
}

export default Card;
export { CARD_SYMBOL };