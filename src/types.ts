import Card from "./Card";
import { CHOICES } from "./Constants";
import Game from "./Game";

export type ColorFunction = (str: string) => string;

export interface Range {
    first: number;
    last: number;
}

export interface Event {
    choice: CHOICES;
    pickedCard: Card;
    pickedCardIndex: number;
    playerIndex: number;
}

export type StrategyFunction = ((game: Game) => CHOICES) | ((game: Game) => Promise<CHOICES>);
