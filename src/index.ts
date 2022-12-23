import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import Strategies from "./Strategies";
import Minimax from "./Strategies/Minimax";

const cardsNumber = 12;
const board = Game.generateCards(cardsNumber);

const players = [
    new Player("Bot 1", new Strategies.Minimax(), colors.yellow),
    new Player("Player 1", new Strategies.UserInput(), colors.red),
    new Player("Bot 2", new Strategies.Random(), colors.blue),
    new Player("Player 2", new Strategies.UserInput(), colors.green),
];

const game = new Game(players, board);
const minimax = players[0].strategy as Minimax;

async function main() {
    const timeDelay = 1000;
    await game.play(timeDelay);
    console.log(game.endScreen());

    console.log("\nInitial Nash equilibrium:");
    const nashEquilibrium = minimax.nashEquilibrium(game,
        { first: 0, last: cardsNumber - 1 }
    );
    console.log(nashEquilibrium.map((score, index) =>
        `${players[index].colorizedName}: ${score}`
    ).join("\n"));
}

main();