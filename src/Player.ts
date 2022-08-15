import { CHOICES } from "./Constants";
import Game from "./Game";

export type StrategyFunction = (game: Game) => CHOICES

class Player {
    public name: string;
    public strategy: StrategyFunction;

    constructor(name: string, strategy: StrategyFunction) {
        this.name = name;
        this.strategy = strategy;
    }


}

export default Player;