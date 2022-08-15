import colors from "colors/safe";
import Card from "./Card";
import { CHOICES } from "./Constants";
import Player from "./Player";
import { generateCards } from "./Utils";
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
        while (!this.isLastTurn()) {
            await this.playOneTurn();
        }
        const choice = CHOICES.FIRST;
        const pickedCard = this.pickCard(choice);
        this.changeScore(pickedCard);
        this.updateHistory(choice, pickedCard, this.currentPlayerIndex);
    }

    private async playOneTurn() {
        const choice = await this.currentPlayer.strategy(this);
        const pickedCard = this.pickCard(choice);
        this.changeScore(pickedCard);
        this.updateHistory(choice, pickedCard, this.currentPlayerIndex);
        this.switchPlayer();
    }

    private updateHistory(choice: CHOICES, pickedCard: Card, playerIndex: number) {
        this.history.push({ choice, pickedCard, playerIndex });
        this.eventIndexByCard.set(pickedCard, this.history.length - 1);
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
        return this.range.last - this.range.first === -1;
    }

    public isLastTurn(): boolean {
        return this.range.last === this.range.first;

    }

    public toString(): string {
        return this.board.map((card, index) => {
            if (index === this.range.first || index === this.range.last && this.range.first <= this.range.last) {
                return colors.bold(card.toString());
            } else if (index > this.range.first && index < this.range.last) {
                return colors.dim(card.toString());
            } else {
                return this.players[this.history[this.eventIndexByCard.get(card) || 0].playerIndex].colorFunction(card.toString());
            }
        }).join(" ");
    }

    public scoreString() {
        return colors.bold("Scores: ") + this.players.map((player, index) => `${player.colorizedName}: ${this.scores[index]}`).join(" | ");
    }
}

export default Game;