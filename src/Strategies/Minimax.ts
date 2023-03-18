import Game, { CHOICES, Range } from "../Game";
import Strategy from "../Game/Strategy";
import TieBreaker, { maximumTieBreaker } from "./TieBreaker";

interface Situation {
    scores: number[],
    bestChoice?: CHOICES,
}

class Minimax implements Strategy {
    readonly name;
    private matrix?: Situation[][];
    private game?: Game;
    private breakTie: TieBreaker;
    private static defaultTieBreaker = maximumTieBreaker;

    constructor(breakTie?: TieBreaker) {
        this.name = "Minimax";
        this.breakTie = breakTie || Minimax.defaultTieBreaker;
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

    /**
     * @returns the situation in the given game state by evaluating it if
     * necessary
     */
    private getSituation({ first, last }: Range, playerIndex: number) {
        if (this.hasComputed({ first, last }))
            return this.matrix![first][last];

        const nextPlayer = (playerIndex + 1) % this.game!.playersNumber;

        const situations = {
            [CHOICES.FIRST]:
                this.getSituation({ first: first + 1, last }, nextPlayer),
            [CHOICES.LAST]:
                this.getSituation({ first, last: last - 1 }, nextPlayer),
        };

        const scores = {
            [CHOICES.FIRST]:
                situations[CHOICES.FIRST].scores[playerIndex]
                + this.game!.board[first].value,
            [CHOICES.LAST]:
                situations[CHOICES.LAST].scores[playerIndex]
                + this.game!.board[last].value,
        };

        // Choose the best situation
        const bestChoice = (scores[CHOICES.FIRST] > scores[CHOICES.LAST])
            ? CHOICES.FIRST
            : (scores[CHOICES.FIRST] !== scores[CHOICES.LAST])
                ? CHOICES.LAST
                : this.breakTie(this.game!);

        // Update current situation
        const current = this.matrix![first][last];
        current.bestChoice = bestChoice;
        current.scores = situations[bestChoice].scores.slice();
        current.scores[playerIndex] = scores[bestChoice];

        return current;
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
