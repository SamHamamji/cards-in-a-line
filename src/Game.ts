import Card from "./Card";
import Player from "./Player";
import Utils, { generateDefaultDeck } from "./Utils";

class Game {
    players: Player[];
    scores: number[];
    cardsNumber: number;
    board: Card[];

    constructor(players: Player[], cardsNumber = 52) {
        this.players = players;
        this.cardsNumber = cardsNumber;
        this.board = Game.generateCards(this.cardsNumber);
        this.scores = new Array(players.length).fill(0);
    }

    private static generateCards(n: number): Card[] {
        return Utils.shuffle<Card>(generateDefaultDeck()).splice(0, n);
    }

    public toString(): string {
        // TODO: make a better logger
        return this.board.join(" ");
    }
}

export default Game;