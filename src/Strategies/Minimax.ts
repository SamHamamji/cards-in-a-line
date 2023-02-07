import Game, { CHOICES, Range } from "../Game";
import Strategy from "../Game/Strategy";

interface Situation {
    scores: number[],
    bestChoice?: CHOICES,
}

class Minimax implements Strategy {
    readonly name;
    private matrix?: Situation[][];
    private game?: Game;

    constructor() {
        this.name = "Minimax";
    }

    public choice(game: Game) {
        if (!this.isInitialized())
            this.initialize(game);
        else if (this.game !== game)
            throw new Error("Given game doesn't match stored game");

        return this.getSituation(game.range, game.currentPlayerIndex).bestChoice!;
    }

    private isInitialized() {
        return this.game !== undefined && this.matrix !== undefined;
    }

    private initialize(game: Game) {
        this.game = game;
        this.initializeMatrix();
        this.fillBaseCases();
    }

    private initializeMatrix(): void {
        const game = this.game!;
        this.matrix = Array.from({ length: game.cardsNumber }, () =>
            Array.from({ length: game.cardsNumber }, (): Situation => ({
                scores: Array.from({ length: game.playersNumber }, () => NaN)
            }))
        );
    }

    /**
     * Base cases:
     * Each game where one card is left (range.first = range.last) ends with
     * all the players having 0 except the last player
     */
    private fillBaseCases() {
        const game = this.game!;
        const lastPlayer = (game.cardsNumber - 1) % game.players.length;
        for (let i = 0; i < game.cardsNumber; i++) {
            const baseCase = this.matrix![i][i];
            baseCase.scores.fill(0);
            baseCase.scores[lastPlayer] = game.board[i].value;
            baseCase.bestChoice = CHOICES.FIRST;
        }
    }

    /** Fills the matrix with the right values */
    private getSituation({ first, last }: Range, playerIndex: number) {
        const situation = this.matrix![first][last];
        if (this.hasComputed({ first, last }))
            return situation;

        const nextPlayer = (playerIndex + 1) % this.game!.playersNumber;
        const left = this.getSituation({ first: first + 1, last }, nextPlayer);
        const right = this.getSituation({ first, last: last - 1 }, nextPlayer);

        const leftScore = left.scores[playerIndex]
            + this.game!.board[first].value;
        const rightScore = right.scores[playerIndex]
            + this.game!.board[last].value;

        // Choose the best situation
        if (leftScore > rightScore ||
            (leftScore === rightScore && Math.random() < 0.5)) {
            situation.scores = left.scores.slice();
            situation.scores[playerIndex] = leftScore;
            situation.bestChoice = CHOICES.FIRST;
        } else {
            situation.scores = right.scores.slice();
            situation.scores[playerIndex] = rightScore;
            situation.bestChoice = CHOICES.LAST;
        }

        return situation;
    }

    /** @returns the scores of the nash equilibrium in the given game state */
    public nashEquilibrium(range?: Range) {
        const game = this.game!;
        if (range === undefined)
            range = game.range;

        return this.getSituation(
            game.range,
            (game.cardsNumber - game.history.length - 1) % game.players.length
        ).scores;
    }

    private hasComputed({ first, last }: Range) {
        if (first > last)
            throw new Error(`Range is not valid: ${first} > ${last}`);
        const situation = this.matrix![first][last];
        return situation.bestChoice !== undefined;
    }
}

export default Minimax;
