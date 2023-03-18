import Game, { CHOICE } from "../index";
import Strategy from "../Strategy";

class Clone implements Strategy {
    readonly name;

    constructor() {
        this.name = "Clone";
    }

    choice(game: Game) {
        const previous = game.history.at(-1);
        if (!previous)
            return Math.random() < 0.5 ? CHOICE.FIRST : CHOICE.LAST;
        return previous.choice;
    }
}

export default Clone;
