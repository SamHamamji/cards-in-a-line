import Card from "./Card";
import Player from "./Player";

enum CHOICES { FIRST, LAST }

interface Range {
    first: number;
    last: number;
}

interface Event {
    choice: CHOICES;
    pickedCard: Card;
    pickedCardIndex: number;
    playerIndex: number;
    time: number;
}

class Game {
    readonly players: Player[];
    readonly playersNumber: number;
    currentPlayerIndex = 0;
    scores: number[];
    readonly cardsNumber: number;
    readonly board: Card[];
    readonly range: Range;
    /** 
     * @summary Chronological history of the events
     * @description The first index corresponds to the earliest event
     */
    readonly history: Event[] = [];

    constructor(players: Player[], board: Card[]) {
        this.players = players;
        this.board = board;
        this.cardsNumber = board.length;
        this.playersNumber = players.length;
        this.scores = new Array(this.playersNumber).fill(0);
        this.range = { first: 0, last: this.cardsNumber - 1 };
    }

    get currentPlayer() { return this.players[this.currentPlayerIndex]; }

    async playOneRound() {
        const choice = await this.currentPlayer.strategy.choice(this);
        const pickedCardIndex = this.pickCard(choice);
        this.updateScore(pickedCardIndex);
        this.updateHistory(choice, pickedCardIndex, this.currentPlayerIndex);
        this.updatePlayer();
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

    private updateScore(pickedCardIndex: number) {
        this.scores[this.currentPlayerIndex] += this.board[pickedCardIndex].value;
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

    private updatePlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % (this.playersNumber);
    }

    public isOver(): boolean {
        return this.range.last - this.range.first === -1;
    }

    /**
     * @returns a 2d array of objects containing the player and their score
     * @description the first element of the outer array contains the winner(s), etc... 
     */
    public ranking() {
        const answer: {
            player: Player,
            score: number
        }[][] = this.players.map((player, index) => ([{
            player,
            score: this.scores[index]
        }]));
        answer.sort((a, b) => (b[0].score - a[0].score));
        for (let index = 0; index < answer.length - 1; index++) {
            if (answer[index][0].score === answer[index + 1][0].score) {
                answer[index].push(answer[index + 1][0]);
                answer.splice(index + 1, 1);
                index--;
            }
        }
        return answer;
    }
}

export default Game;
export { CHOICES, Event, Range };
