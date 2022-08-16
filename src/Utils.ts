import Card from "./Card";
import { CARD_SYMBOLS_ARRAY } from "./Constants";

export function shuffle<T>(array: T[]) {
    const shuffled: T[] = [];
    const unusedIndexes = Array.from({ length: array.length }, (_, i) => i);
    for (let _ = 0; _ < array.length; _++) {
        const index = Math.floor(Math.random() * unusedIndexes.length);
        shuffled.push(array[unusedIndexes.splice(index, 1)[0]]);
    }
    return shuffled;
}

export function generateDefaultDeck() {
    const deck: Card[] = [];
    for (let i = 0; i < 52; i++) {
        deck.push(new Card(i % 13 + 1, CARD_SYMBOLS_ARRAY[Math.floor(i / 13)]));
    }
    return deck;
}

export function generateCards(n: number): Card[] {
    return shuffle<Card>(generateDefaultDeck()).splice(0, n);
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
