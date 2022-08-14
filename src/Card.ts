import { CARD_SYMBOLS } from "./Constants";

class Card {
    public value: number;
    public type: CARD_SYMBOLS;

    constructor(value: number, type: CARD_SYMBOLS) {
        this.value = value;
        this.type = type;
    }

    public toString(): string {
        if (this.type == CARD_SYMBOLS.SPADES) {
            return `${this.value.toString().padStart(2, "0")}♠`;
        }
        if (this.type == CARD_SYMBOLS.HEARTS) {
            return `${this.value.toString().padStart(2, "0")}♥`;
        }
        if (this.type == CARD_SYMBOLS.CLUBS) {
            return `${this.value.toString().padStart(2, "0")}♣`;
        }
        if (this.type == CARD_SYMBOLS.DIAMONDS) {
            return `${this.value.toString().padStart(2, "0")}♦`;
        }
        return "UNKNOWN CARD TYPE";
    }
}

export default Card;