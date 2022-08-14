import Game from "./Game";
import Player from "./Player";

const game = new Game([new Player("Player 1"), new Player("Player 2")]);

console.log(game.toString());