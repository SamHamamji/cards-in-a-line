import Card from "./Card";
import { CARD_SYMBOLS_ARRAY, CHOICES } from "./Constants";
import Game from "./Game";
import Player from "./Player";

const array = [1, 2, 3, 4, 0, 0, 0, 100];

const board = array.map(i => new Card(i, CARD_SYMBOLS_ARRAY[Math.floor(Math.random() * CARD_SYMBOLS_ARRAY.length)]));

const game = new Game([
    new Player("Left", () => CHOICES.FIRST),
    new Player("Right", () => CHOICES.LAST)
], board);

game.play();

console.log(game.toString());
console.log(game.scores);
console.log(game.history);