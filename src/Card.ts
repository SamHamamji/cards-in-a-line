import { CARD_SYMBOLS } from "./Constants";

class Card {
    public number: number;
    public type: CARD_SYMBOLS;

    constructor(number: number, type: CARD_SYMBOLS) {
        this.number = number;
        this.type = type;
    }

    public toString(): string {
        if (this.type == CARD_SYMBOLS.SPADES) {
            return `${this.number.toString().padStart(2, "0")}♠`;
        }
        if (this.type == CARD_SYMBOLS.HEARTS) {
            return `${this.number.toString().padStart(2, "0")}♥`;
        }
        if (this.type == CARD_SYMBOLS.CLUBS) {
            return `${this.number.toString().padStart(2, "0")}♣`;
        }
        if (this.type == CARD_SYMBOLS.DIAMONDS) {
            return `${this.number.toString().padStart(2, "0")}♦`;
        }
        return "UNKNOWN CARD TYPE";
    }
}

export default Card;