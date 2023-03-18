import Game, { CHOICE } from "../index";
import Strategy, { TieBreaker, randomTieBreaker } from "../Strategy";

/**
 * Chooses the card with the highest value.
 */
class ChooseMaximum implements Strategy {
    readonly name;
    readonly breakTie: TieBreaker;
    private static defaultTieBreaker = randomTieBreaker;

    constructor(breakTie?: TieBreaker) {
        this.name = "ChooseMaximum";
        this.breakTie = breakTie || ChooseMaximum.defaultTieBreaker;
    }

    choice(game: Game) {
        if (game.board[game.range.first] > game.board[game.range.last])
            return CHOICE.FIRST;
        else if (game.board[game.range.first] !== game.board[game.range.last])
            return CHOICE.LAST;
        else
            return this.breakTie(game);
    }
}

export default ChooseMaximum;
