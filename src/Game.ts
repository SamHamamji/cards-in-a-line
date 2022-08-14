import Card from "./Card";
import { CHOICES } from "./Constants";
import Player from "./Player";
import { generateCards } from "./Utils";

interface Range {
    first: number; last: number;
}

class Game {
    readonly players: Player[];
    readonly playersNumber: number;
    currentPlayerIndex = 0;
    scores: number[];
    readonly cardsNumber: number;
    readonly board: Card[];
    readonly range: Range;

    constructor(players: Player[], board: Card[] = Game.generateCards(52)) {
        this.players = players;
        this.board = board;
        this.cardsNumber = board.length;
        this.playersNumber = players.length;
        this.scores = new Array(this.playersNumber).fill(0);
        this.range = { first: 0, last: this.cardsNumber - 1 };
    }

    get currentPlayer() { return this.players[this.currentPlayerIndex]; }

    public play() {
        while (!this.isOver()) {
            this.playOneTurn();
        }
    }

    public playOneTurn() {
        const choice = this.currentPlayer.strategy(this);
        const pickedCard = this.pickCard(choice);
        this.changeScore(pickedCard);
        this.switchPlayer();
    }

    private pickCard(choice: CHOICES): Card {
        let pickedCard: Card;
        if (choice === CHOICES.FIRST) {
            pickedCard = this.board[this.range.first];
            this.range.first++;
        } else {
            pickedCard = this.board[this.range.last];
            this.range.last--;
        }
        return pickedCard;
    }

    private changeScore(pickedCard: Card) {
        this.scores[this.currentPlayerIndex] += pickedCard.value;
    }

    private switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % (this.playersNumber);
    }

    public isOver(): boolean {
        return this.range.last === this.range.first;
    }

    private static generateCards = generateCards;

    public toString(): string {
        // TODO: make a better logger
        return this.board.join(" ");
    }
}

export default Game;