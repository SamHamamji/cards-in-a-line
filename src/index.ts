import Game from "./Game";
import Player from "./Player";
import { alwaysFirst, alwaysLast } from "./Strategies";

// The default card number is 52
const board = Game.generateCards(20);

const game = new Game([
    new Player("Player 1", alwaysFirst),
    new Player("Player 2", alwaysLast)
], board);

game.play();

console.log(game.toString());
console.log(game.scores);
console.log(game.history);