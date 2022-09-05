import { CHOICES } from "../Constants";
import Game from "../Game";
import Strategy from "../Strategy";

class Minimax extends Strategy {
    readonly name;
    readonly knowsOtherStrategies: boolean;
    private matrixGenerated: boolean;
    private matrix: { scores: number[], isComputed: boolean, bestChoice: CHOICES }[][][];
    constructor() {
        super();
        this.name = "Minimax";
        this.knowsOtherStrategies = false;
        this.matrix = [];
        this.matrixGenerated = false;
    }

    async choice(game: Game) {
        if (!this.matrixGenerated) {
            this.initializeMatrix(game);
            this.computeMatrix(game);
        }
        // await delay(1000000);
        return this.matrix[game.range.first][game.range.last][game.currentPlayerIndex].bestChoice;
    }

    private initializeMatrix(game: Game): void {
        this.matrix = Array.from({ length: game.cardsNumber }, () =>
            Array.from({ length: game.cardsNumber }, () =>
                Array.from({ length: game.playersNumber }, () => {
                    return {
                        scores: Array.from({ length: game.playersNumber }, () => -1),
                        isComputed: false,
                        bestChoice: CHOICES.FIRST
                    };
                }
                )
            )
        );

        /* Base case:
        each game where one card is left ends with all the players having 0 except the current player
        */
        for (let i = 0; i < game.cardsNumber; i++) {
            for (let player = 0; player < game.playersNumber; player++) {
                this.matrix[i][i][player].scores.fill(0);
                this.matrix[i][i][player].scores[player] = game.board[i].value;
                this.matrix[i][i][player].isComputed = true;
            }
        }
    }

    private computeMatrix(game: Game): void {
        this.computeMatrixHelper(game, game.range.first, game.range.last, game.currentPlayerIndex);
        // console.log(JSON.stringify(this.matrix, null, 4));
    }

    private computeMatrixHelper(game: Game, i: number, j: number, playerIndex: number) {
        if (i > j) {
            throw new Error(`i (${i}) > j y(${j})`);
        }
        const situation = this.matrix[i][j][playerIndex];
        if (!situation.isComputed) {
            const nextPlayerIndex = (playerIndex + 1) % game.playersNumber;
            const leftSituation = this.matrix[i + 1][j][nextPlayerIndex];
            const rightSituation = this.matrix[i][j - 1][nextPlayerIndex];
            this.computeMatrixHelper(game, i + 1, j, nextPlayerIndex);
            this.computeMatrixHelper(game, i, j - 1, nextPlayerIndex);

            // Chooses which choice is best
            let bestSituation: { scores: number[], isComputed: boolean, bestChoice: CHOICES };
            // TODO: if both are equal, choose 
            if (leftSituation.scores[playerIndex] + game.board[i].value >=
                rightSituation.scores[playerIndex] + game.board[j].value) {
                bestSituation = leftSituation;
                situation.bestChoice = CHOICES.FIRST;
            }
            else {
                bestSituation = rightSituation;
                situation.bestChoice = CHOICES.LAST;
            }

            // Update scores for the player
            for (let playerScoreIndex = 0; playerScoreIndex < game.playersNumber; playerScoreIndex++) {
                situation.scores[playerScoreIndex] = bestSituation.scores[playerScoreIndex];
            }
            situation.scores[playerIndex] += ((situation.bestChoice == CHOICES.FIRST) ? game.board[i] : game.board[j]).value;
            situation.isComputed = true;
        }
    }
}
// TODO: test if the board is symmetrical, it should choose the left
export default Minimax;