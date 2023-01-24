import Strategy from "./Strategy";
import UserInput from "../Strategies/UserInput";
import { Color } from "colors/index";

class Player {
    public readonly name: string;
    public readonly strategy: Strategy;
    public readonly colorize: Color;

    constructor(name: string, strategy: Strategy, Color: Color) {
        this.name = name;
        this.strategy = strategy;
        this.colorize = Color;
    }

    get colorizedName() {
        return this.colorize(this.name);
    }

    isUser() {
        return this.strategy instanceof UserInput;
    }
}

export default Player;