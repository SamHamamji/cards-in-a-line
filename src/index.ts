import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { Minimax, Random, UserInput } from "./Strategies";

// const board = [11, 1, 5, 4, 11, 13, 4, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
const cardsNumber = 12;
const board = Game.generateCards(cardsNumber);

const players = [
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Player 1", new UserInput(), colors.red),
    new Player("Bot 2", new Random(), colors.blue),
    new Player("Player 2", new UserInput(), colors.green),
];

const game = new Game(players, board);
const minimax = players[0].strategy as Minimax;

async function main(){
    const timeDelay = 1000;
    await game.play(timeDelay);
    console.log(game.endScreen());
    
    console.log("\nInitial Nash equilibrium:");
    const nashEquilibrium = minimax.nashEquilibrium(game, 
        { first: 0, last: cardsNumber - 1 }
    );
    console.log(nashEquilibrium.map((score, index)=>
        `${players[index].colorizedName}: ${score}`
    ).join("\n"));
}

main();