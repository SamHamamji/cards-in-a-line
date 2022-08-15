import { StrategyFunction } from "./types";

class Player {
    public name: string;
    public strategy: StrategyFunction;

    constructor(name: string, strategy: StrategyFunction) {
        this.name = name;
        this.strategy = strategy;
    }


}

export default Player;