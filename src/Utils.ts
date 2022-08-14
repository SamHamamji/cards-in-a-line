import Card from "./Card";
import { CARD_SYMBOLS_ARRAY } from "./Constants";

function shuffle<T>(array: T[]) {
    const shuffled: T[] = [];
    const unusedIndexes = Array.from({ length: array.length }, (_, i) => i);
    for (let _ = 0; _ < array.length; _++) {
        const index = Math.floor(Math.random() * unusedIndexes.length);
        shuffled.push(array[unusedIndexes.splice(index, 1)[0]]);
    }
    return shuffled;
}

export const generateDefaultDeck = () => Array.from({ length: 52 }, (_, i) => new Card(i % 13 + 1, CARD_SYMBOLS_ARRAY[Math.floor(i / 13)]));


export default { shuffle };