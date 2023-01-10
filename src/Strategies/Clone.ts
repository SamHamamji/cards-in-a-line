import Game, { CHOICES } from "../Game";
import Strategy from "../Game/Strategy";

class Clone implements Strategy {
    readonly name;

    constructor() {
        this.name = "Clone";
    }

    choice(game: Game) {
        const previous = game.history.at(-1);
        if (!previous)
            return Math.random() < 0.5 ? CHOICES.FIRST : CHOICES.LAST;
        return previous.choice;
    }
}

export default Clone;
