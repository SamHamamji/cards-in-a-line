import colors from "colors/safe";
import Card from "./Card";
import { CHOICES } from "./Constants";
import Player from "./Player";
import { addBorder, delay, generateCards } from "./Utils";
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

    public async play(timeDelay = 1500) {
        while (!this.isOver()) {
            console.log(colors.bold("Scores: ") + this.scoreLine());
            console.log(addBorder(this.boardLine() + "\n" + this.arrowLine()));
            await delay(timeDelay);
            await this.playOneTurn();
            console.clear();
        }
    }

    private async playOneTurn() {
        const choice = await this.currentPlayer.strategy.choice(this);
        const pickedCardIndex = this.pickCard(choice);
        this.changeScore(pickedCardIndex);
        this.updateHistory(choice, pickedCardIndex, this.currentPlayerIndex);
        this.switchPlayer();
    }

    private updateHistory(choice: CHOICES, pickedCardIndex: number, playerIndex: number) {
        this.history.push({
            choice,
            pickedCard: this.board[pickedCardIndex],
            pickedCardIndex,
            playerIndex,
            time: this.history.length
        });
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

    public boardLine(): string {
        const boardRepr = new Array(this.cardsNumber).fill("   ");
        this.history.forEach(event => {
            boardRepr[event.pickedCardIndex] = this.players[event.playerIndex].colorize(event.pickedCard.toString());
        });
        for (let index = this.range.first; index <= this.range.last; index++) {
            boardRepr[index] = colors.dim(this.board[index].toString());
        }
        if (!this.isOver()) {
            [this.range.first, this.range.last].forEach(index => {
                boardRepr[index] = colors.bold(this.board[index].toString());
            });
        }
        return boardRepr.join(" ");
    }

    public scoreLine() {
        return this.players.map((player, index) => `${player.colorizedName}: ${this.scores[index]}`).join(" | ");
    }

    private arrowLine() {
        if (this.history.length === 0) {
            return "";
        }
        const currentEvent = this.history[this.history.length - 1];
        return " ".repeat(4 * currentEvent.pickedCardIndex + 1) + this.players[currentEvent.playerIndex].colorize(colors.bold("^"));
    }

    private historyLine() {
        const historyRepr = new Array(this.cardsNumber).fill("   ");
        this.history.forEach((element, time) => {
            historyRepr[element.pickedCardIndex] = ` ${(time + 1).toString().padEnd(2, " ")}`;
        });
        return colors.dim(historyRepr.join(" "));
    }

    /**
     * @returns a 2d array of objects containing the player and their score
     * @description the first element of the outer array contains the winner(s), etc... 
     */
    private ranking() {
        const answer: {
            player: Player,
            score: number
        }[][] = this.players.map((player, index) => ([{
            player,
            score: this.scores[index]
        }]));
        answer.sort((a, b) => (b[0].score - a[0].score));
        for (let index = 0; index < answer.length - 1; index++) {
            if (answer[index][0].score == answer[index + 1][0].score) {
                answer[index].push(answer[index + 1][0]);
                answer.splice(index + 1, 1);
                index--;
            }
        }
        return answer;
    }

    private rankingLines(): string {
        return this.ranking().map((array, index) =>
            array.map((element) =>
                `${index + 1}. ${element.player.colorizedName} (${element.player.strategy.name}): ${element.score}`
            ).join("\n")
        ).join("\n");
    }

    public endScreen(): string {
        return "The game has ended\n"
            + addBorder(this.boardLine() + "\n" + this.historyLine()) // shows board and history
            + "\nRanking:\n" + this.rankingLines(); // shows ranking
    }
}

export default Game;