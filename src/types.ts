import Card from "./Card";
import { CHOICES } from "./Constants";
import Game from "./Game";


export interface Range {
    first: number;
    last: number;
}

export interface Event {
    choice: CHOICES;
    pickedCard: Card;
}

export type StrategyFunction = (game: Game) => CHOICES;
