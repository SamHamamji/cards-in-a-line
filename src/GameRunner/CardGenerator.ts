import Card, { CARD_SYMBOL } from "../Card";

class CardGenerator {
    static shuffle<Type>(array: Type[]) {
        const shuffled: Type[] = [];
        const unusedIndexes = Array.from({ length: array.length }, (_, i) => i);
        for (let _ = 0; _ < array.length; _++) {
            const index = Math.floor(Math.random() * unusedIndexes.length);
            shuffled.push(array[unusedIndexes.splice(index, 1)[0]]);
        }
        return shuffled;
    }

    static generateDefaultDeck() {
        const deck: Card[] = [];
        for (const symbol of [
            CARD_SYMBOL.SPADES,
            CARD_SYMBOL.HEARTS,
            CARD_SYMBOL.CLUBS,
            CARD_SYMBOL.DIAMONDS,
        ]) {
            for (let i = 0; i < 52; i++) {
                deck.push(new Card(i % 13 + 1, symbol));
            }
        }
        return deck;
    }

    static generateCards(n: number): Card[] {
        return CardGenerator.shuffle<Card>(
            CardGenerator.generateDefaultDeck()
        ).splice(0, n);
    }
}

export default CardGenerator;