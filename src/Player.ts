import { StrategyFunction, ColorFunction } from "./types";

class Player {
    public readonly name: string;
    public readonly strategy: StrategyFunction;
    public readonly colorize: ColorFunction;

    constructor(name: string, strategy: StrategyFunction, colorFunction: ColorFunction = (s) => s) {
        this.name = name;
        this.strategy = strategy;
        this.colorize = colorFunction;
    }

    get colorizedName() {
        return this.colorize(this.name);
    }

}

export default Player;