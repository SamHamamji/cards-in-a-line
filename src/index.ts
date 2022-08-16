import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { alwaysFirst, alwaysLast, userInput } from "./Strategies";

// The default card number is 52
const board = Game.generateCards(20);

const game = new Game([
    new Player("Player 1", alwaysFirst, colors.red),
    new Player("Player 2", userInput, colors.cyan),
    new Player("Player 3", alwaysLast, colors.yellow),
], board);

(async () => {
    await game.play();
    console.log(game.toString());
    console.log(game.range);
    console.log(game.scores);
    console.log(game.history);
})();
