import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { Minimax, UserInput } from "./Strategies";

// The default card number is 52
// const board = [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
const board = Game.generateCards(52);

const game = new Game([
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Bot 2", new Minimax(), colors.green)
], board);

(async () => {
    await game.play(1000);
    console.log(game.endScreen());
})();
