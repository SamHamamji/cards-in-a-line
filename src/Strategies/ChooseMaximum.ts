import { CHOICES } from "../Constants";
import Game from "../Game";
import Strategy from "../Strategy";

/**
 * chooses the card with the highest value. If both cards have the same value, the choice is done randomly
 */
class ChooseMaximum implements Strategy {
    readonly name;
    readonly choiceIfEqual: (game: Game) => CHOICES;
    constructor(choiceIfEqual?: (game: Game) => CHOICES) {
        this.name = "ChooseMaximum";
        this.choiceIfEqual = choiceIfEqual || ChooseMaximum.random;
    }

    choice(game: Game) {
        if (game.board[game.range.first] > game.board[game.range.last]) {
            return CHOICES.FIRST;
        } else if (game.board[game.range.first] != game.board[game.range.last]) {
            return CHOICES.LAST;
        } else { return this.choiceIfEqual(game); }
    }

    static random() {
        return (Math.random() < 0.5) ? CHOICES.FIRST : CHOICES.LAST;
    }
}

export default ChooseMaximum;
