import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { ChooseMaximum, Minimax, Random, UserInput } from "./Strategies";

// The default card number is 52
// const board = [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
const board = Game.generateCards(24);

const game = new Game([
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Player 1", new UserInput(), colors.green),
    new Player("Bot 2", new ChooseMaximum(), colors.red),
    new Player("Bot 2", new Random(), colors.red)

], board);

(async () => {
    await game.play(1000);
    console.log(game.endScreen());
})();
