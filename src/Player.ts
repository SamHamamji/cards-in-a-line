import Strategy from "./Strategy";
import { ColorFunction } from "./types";

class Player {
    public readonly name: string;
    public readonly strategy: Strategy;
    public readonly colorize: ColorFunction;

    constructor(name: string, strategy: Strategy, colorFunction: ColorFunction = (s) => s) {
        this.name = name;
        this.strategy = strategy;
        this.colorize = colorFunction;
    }

    get colorizedName() {
        return this.colorize(this.name);
    }

}

export default Player;