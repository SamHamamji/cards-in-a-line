import colors from "colors/safe";
import Card from "./Card";
import { CARD_SYMBOLS } from "./Constants";
import Game from "./Game";
import Player from "./Player";
import { randomChoice } from "./Strategies";

// The default card number is 52
const board = [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));

const game = new Game([
    new Player("Bot 1", randomChoice, colors.red),
    new Player("Bot 2", randomChoice, colors.yellow),
    new Player("Bot 3", randomChoice, colors.cyan),
    new Player("Bot 4", randomChoice, colors.green)
], board);

(async () => {
    await game.play(500);
    console.log(game.endScreen());
})();
