import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { Minimax, UserInput } from "./Strategies";
import { delay } from "./Utils";

// const board = [11, 1, 5, 4, 11, 13, 4, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
const cardsNumber = 8;
const board = Game.generateCards(cardsNumber);

const players = [
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Player 1", new UserInput(), colors.green)
];

const game = new Game(players, board);
const minimax = players[0].strategy as Minimax;

(async () => {
    console.log("Nash equilibrium: ",
        (minimax.nashEquilibrium(game)));
    delay(5000);
    await game.play(1000);
    console.log(game.endScreen());
    // This causes an error
    // console.log("Nash equilibrium: ",
    //     (minimax.nashEquilibrium(game, { first: 0, last: cardsNumber - 1 })));
})();
