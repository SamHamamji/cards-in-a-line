import colors from "colors/safe";
import Card from "./Card";
import { CARD_SYMBOLS } from "./Constants";
import Game from "./Game";
import Player from "./Player";
import { ChooseMaximum, Random, UserInput } from "./Strategies";

// The default card number is 52
// const board = [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
const board = Game.generateCards(16);

const game = new Game([
    new Player("Bot 1", new Random(), colors.red),
    new Player("Sam", new UserInput(), colors.green),
    new Player("Bot 2", new ChooseMaximum(ChooseMaximum.random), colors.yellow)
], board);

(async () => {
    await game.play(1000);
    console.log(game.endScreen());
})();
