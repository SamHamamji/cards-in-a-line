import Strategy from "./Strategy";
import UserInput from "../Strategies/UserInput";

type ColorFunction = (str: string) => string;

class Player {
    public readonly name: string;
    public readonly strategy: Strategy;
    public readonly colorize: ColorFunction;

    constructor(name: string, strategy: Strategy, colorFunction: ColorFunction = s => s) {
        this.name = name;
        this.strategy = strategy;
        this.colorize = colorFunction;
    }

    get colorizedName() {
        return this.colorize(this.name);
    }

    isUser() {
        return this.strategy instanceof UserInput;
    }
}

export default Player;