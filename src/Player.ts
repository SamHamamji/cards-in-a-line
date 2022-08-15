import colors from "colors/safe";
import { StrategyFunction, ColorFunction } from "./types";

class Player {
    public readonly name: string;
    public readonly strategy: StrategyFunction;
    public readonly colorFunction: ColorFunction;

    constructor(name: string, strategy: StrategyFunction, colorFunction: ColorFunction = (s) => s) {
        this.name = name;
        this.strategy = strategy;
        this.colorFunction = colorFunction;
    }

    get colorizedName() {
        return this.colorFunction(this.name);
    }

}

export default Player;