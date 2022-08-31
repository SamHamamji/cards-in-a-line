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
    time: number;
}

export interface Border {
    top: string;
    left: string;
    bottom: string;
    right: string;
    topLeft: string;
    topRight: string;
    bottomRight: string;
    bottomLeft: string;
}

export type StrategyFunction = ((game: Game) => CHOICES) | ((game: Game) => Promise<CHOICES>);
