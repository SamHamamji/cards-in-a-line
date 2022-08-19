import colors from "colors/safe";
import Card from "./Card";
import { CHOICES } from "./Constants";
import Player from "./Player";
import { delay, generateCards } from "./Utils";
import { Event, Range } from "./types";


class Game {
    readonly players: Player[];
    readonly playersNumber: number;
    currentPlayerIndex = 0;
    scores: number[];
    readonly cardsNumber: number;
    readonly board: Card[];
    readonly range: Range;
    /** 
     * @summary History of chronological events
     * @description The first index corresponds to the earliest event
     */
    readonly history: Event[] = [];
    /** 
     * @summary Map from card to index of event in history 
    */
    readonly eventIndexByCard = new Map<Card, number>();

    constructor(players: Player[], board: Card[] = Game.generateCards(52)) {
        this.players = players;
        this.board = board;
        this.cardsNumber = board.length;
        this.playersNumber = players.length;
        this.scores = new Array(this.playersNumber).fill(0);
        this.range = { first: 0, last: this.cardsNumber - 1 };
    }

    get currentPlayer() { return this.players[this.currentPlayerIndex]; }

    public static generateCards = generateCards;

    public async play() {
        while (!this.isOver()) {
            console.log(this.scoreLine());
            console.log(this.toString());
            console.log(this.arrowLine());
            await delay(3000);
            await this.playOneTurn();
            console.clear();
        }
    }

    private async playOneTurn() {
        const choice = await this.currentPlayer.strategy(this);
        const pickedCardIndex = this.pickCard(choice);
        this.changeScore(pickedCardIndex);
        this.updateHistory(choice, pickedCardIndex, this.currentPlayerIndex);
        this.switchPlayer();
    }

    private updateHistory(choice: CHOICES, pickedCardIndex: number, playerIndex: number) {
        const pickedCard = this.board[pickedCardIndex];
        this.history.push({ choice, pickedCard, pickedCardIndex, playerIndex });
        this.eventIndexByCard.set(pickedCard, this.history.length - 1);
    }

    /**
     * @returns picked card index
     */
    private pickCard(choice: CHOICES): number {
        if (choice === CHOICES.FIRST) {
            return this.range.first++;
        } else {
            return this.range.last--;
        }
    }

    private changeScore(pickedCardIndex: number) {
        this.scores[this.currentPlayerIndex] += this.board[pickedCardIndex].value;
    }

    private switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % (this.playersNumber);
    }

    public isOver(): boolean {
        return this.range.last - this.range.first === -1;
    }

    public isLastTurn(): boolean {
        return this.range.last === this.range.first;

    }

    public toString(): string {
        return this.board.map((card, index) => {
            if ((index === this.range.first || index === this.range.last) && this.range.first <= this.range.last) {
                return colors.bold(card.toString());
            } else if (index > this.range.first && index < this.range.last) {
                return colors.dim(card.toString());
            } else {
                return this.players[this.history[this.eventIndexByCard.get(card) || 0].playerIndex].colorFunction(card.toString());
            }
        }).join(" ");
    }

    public scoreLine() {
        return colors.bold("Scores: ") + this.players.map((player, index) => `${player.colorizedName}: ${this.scores[index]}`).join(" | ");
    }

    public arrowLine() {
        if (this.history.length === 0) {
            return "";
        }
        const currentEvent = this.history[this.history.length - 1];
        return " ".repeat(4 * currentEvent.pickedCardIndex + 1) + this.players[currentEvent.playerIndex].colorFunction("🡅");
    }
}

export default Game;