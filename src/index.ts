import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { userInput } from "./Strategies";

console.clear();

// The default card number is 52
const board = Game.generateCards(20);

const game = new Game([
    new Player("Player 1", userInput, colors.red),
    new Player("Player 2", userInput, colors.cyan)
], board);

(async () => {
    await game.play();
    console.log(game.toString());
    console.log(game.scores);
    console.log(game.history);
})();
