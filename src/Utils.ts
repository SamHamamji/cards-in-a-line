import Card from "./Card";
import { BORDERS, CARD_SYMBOLS_ARRAY } from "./Constants";
import { Border } from "./types";

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

export function decolorize(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[.*?m/g, "");
}

export function addBorder(str: string, border: Border = BORDERS.ROUND): string {
    const lines = str.split("\n");
    const width = Math.max(...lines.map(element => decolorize(element).length));
    return `${border.topLeft + border.top.repeat(width) + border.topRight}\n` +
        lines.map(element => border.left + element + " ".repeat(width - decolorize(element).length) + border.right).join("\n") +
        `\n${border.bottomLeft + border.bottom.repeat(width) + border.bottomRight}`;
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
