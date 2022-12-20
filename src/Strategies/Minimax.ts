import { CHOICES } from "../Constants";
import Game from "../Game";
import Strategy from "../Strategy";
import { Range } from "../types";

interface Situation {
    scores: number[],
    isComputed: boolean,
    bestChoice: CHOICES
}

class Minimax extends Strategy {
    readonly name;
    private computedMatrix: boolean;
    private matrix: Situation[][];
    private game: Game | null;
    constructor() {
        super();
        this.name = "Minimax";
        this.matrix = [];
        this.computedMatrix = false;
        this.game = null;
    }

    async choice(game: Game) {
        this.checkGameCorresponds(game);
        if (!this.computedMatrix)
            this.computeMatrix(game);
        return this.matrix[game.range.first][game.range.last].bestChoice;
    }

    private initializeMatrix(game: Game): void {
        this.matrix = Array.from({ length: game.cardsNumber }, () =>
            Array.from({ length: game.cardsNumber }, () => {
                return {
                    scores: Array.from({ length: game.playersNumber }, () => -1),
                    isComputed: false,
                    bestChoice: CHOICES.FIRST
                } as Situation;
            }
            )
        );

        /* Base case:
        each game where one card is left ends with all the players having 0 except the current player
        */
        for (let i = 0; i < game.cardsNumber; i++) {
            for (let player = 0; player < game.playersNumber; player++) {
                this.matrix[i][i].scores.fill(0);
                this.matrix[i][i].scores[player] = game.board[i].value;
                this.matrix[i][i].isComputed = true;
            }
        }
    }

    // Fills the matrix with the right values
    private computeMatrix(game: Game): void {
        this.checkGameCorresponds(game);
        this.initializeMatrix(game);
        this.computeMatrixHelper(game, game.range.first, game.range.last, game.currentPlayerIndex);
        this.computedMatrix = true;
    }

    private computeMatrixHelper(game: Game, i: number, j: number, playerIndex: number) {
        if (i > j) {
            throw new Error(`i (${i}) > j y(${j})`);
        }
        const situation = this.matrix[i][j];
        if (!situation.isComputed) {
            const nextPlayerIndex = (playerIndex + 1) % game.playersNumber;
            const leftSituation = this.matrix[i + 1][j];
            const rightSituation = this.matrix[i][j - 1];
            this.computeMatrixHelper(game, i + 1, j, nextPlayerIndex);
            this.computeMatrixHelper(game, i, j - 1, nextPlayerIndex);

            // Chooses which choice is best
            let bestSituation: { scores: number[], isComputed: boolean, bestChoice: CHOICES };
            const leftScore = leftSituation.scores[playerIndex] + game.board[i].value;
            const rightScore = rightSituation.scores[playerIndex] + game.board[j].value;
            if (leftScore == rightScore) {
                // TODO: if both are equal, choose wisely
                if (Math.random() < 0.5)
                    bestSituation = leftSituation;
                else
                    bestSituation = rightSituation;
            } if (leftScore > rightScore)
                bestSituation = leftSituation;
            else
                bestSituation = rightSituation;

            if (bestSituation === leftSituation)
                situation.bestChoice = CHOICES.FIRST;
            else
                situation.bestChoice = CHOICES.LAST;

            // Update scores
            for (let playerScoreIndex = 0; playerScoreIndex < game.playersNumber; playerScoreIndex++) {
                situation.scores[playerScoreIndex] = bestSituation.scores[playerScoreIndex];
            }
            situation.scores[playerIndex] += ((situation.bestChoice == CHOICES.FIRST) ? game.board[i] : game.board[j]).value;
            situation.isComputed = true;
        }
    }

    /**
     * @returns the scores array of the nash equilibrium in this game state
     */
    public nashEquilibrium(game: Game, range?: Range) {
        if (!this.computedMatrix) {
            this.computeMatrix(game);
        } else {
            this.checkGameCorresponds(game);
        }
        if (range === undefined)
            range = game.range;
        return this.matrix[range.first][range.last].scores;
    }
    /**
     * makes sure game corresponds to the class game
     */
    private checkGameCorresponds(game: Game) {
        if (this.game === null) {
            this.game = game;
        } else if (this.game !== game) {
            throw new Error("Given game doesn't match instance game");
        }
    }
}
export default Minimax;