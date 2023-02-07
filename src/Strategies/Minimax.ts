import Game, { CHOICES, Range } from "../Game";
import Strategy from "../Game/Strategy";

interface Situation {
    scores: number[],
    isComputed: boolean,
    bestChoice?: CHOICES
}

class Minimax implements Strategy {
    readonly name;
    private computedMatrix: boolean;
    private matrix: Situation[][];
    private game: Game | null;

    constructor() {
        this.name = "Minimax";
        this.matrix = [];
        this.computedMatrix = false;
        this.game = null;
    }

    async choice(game: Game) {
        this.checkGameCorresponds(game);
        if (!this.computedMatrix)
            this.fillMatrix(game);
        return this.matrix[game.range.first][game.range.last].bestChoice!;
    }

    private initializeMatrix(game: Game): void {
        this.matrix = Array.from({ length: game.cardsNumber }, () =>
            Array.from({ length: game.cardsNumber }, () => ({
                scores: Array.from({ length: game.playersNumber }, () => NaN),
                isComputed: false,
            }))
        );
    }

    /**
     * Base cases:
     * Each game where one card is left (range.first = range.last) ends with
     * all the players having 0 except the last player
     */
    private fillBaseCases(game: Game) {
        const lastPlayer = (game.cardsNumber - 1) % game.players.length;
        for (let i = 0; i < game.cardsNumber; i++) {
            const baseCase = this.matrix[i][i];
            baseCase.scores.fill(0);
            baseCase.scores[lastPlayer] = game.board[i].value;
            baseCase.isComputed = true;
        }
    }

    /** Fills the matrix with the right values */
    private fillMatrix(game: Game): void {
        this.checkGameCorresponds(game);
        this.initializeMatrix(game);
        this.fillBaseCases(game);
        this.fillMatrixCell(
            game,
            game.range.first,
            game.range.last,
            game.currentPlayerIndex
        );
        this.computedMatrix = true;
    }

    private fillMatrixCell(
        game: Game,
        first: number,
        last: number,
        playerIndex: number,
    ) {
        if (first > last)
            throw new Error(`Range is not valid: ${first} > ${last}`);

        const situation = this.matrix[first][last];
        if (situation.isComputed)
            return;

        const nextPlayerIndex = (playerIndex + 1) % game.playersNumber;

        this.fillMatrixCell(game, first + 1, last, nextPlayerIndex);
        this.fillMatrixCell(game, first, last - 1, nextPlayerIndex);

        const leftSituation = this.matrix[first + 1][last];
        const rightSituation = this.matrix[first][last - 1];

        const leftScore = leftSituation.scores[playerIndex]
            + game.board[first].value;
        const rightScore = rightSituation.scores[playerIndex]
            + game.board[last].value;

        // Choose best situation
        if (leftScore > rightScore ||
            (leftScore === rightScore && Math.random() < 0.5)) {
            situation.scores = leftSituation.scores.slice();
            situation.scores[playerIndex] = leftScore;
            situation.bestChoice = CHOICES.FIRST;
        } else {
            situation.scores = rightSituation.scores.slice();
            situation.scores[playerIndex] = rightScore;
            situation.bestChoice = CHOICES.LAST;
        }
        situation.isComputed = true;
    }

    /**
     * @returns the scores array of the nash equilibrium in this game state
     */
    public nashEquilibrium(game: Game, range?: Range) {
        if (!this.computedMatrix)
            this.fillMatrix(game);
        else
            this.checkGameCorresponds(game);

        if (range === undefined)
            range = game.range;
        return this.matrix[range.first][range.last].scores;
    }

    /**
     * Makes sure game corresponds to the class game
     */
    private checkGameCorresponds(game: Game) {
        if (this.game === null)
            this.game = game;
        else if (this.game !== game)
            throw new Error("Given game doesn't match instance game");
    }
}

export default Minimax;
