import Strategy from "./Strategy";
import UserInput from "../Strategies/UserInput";
import { Color } from "colors/index";

class Player {
    public readonly name: string;
    public readonly strategy: Strategy;
    public readonly color: Color;

    constructor(name: string, strategy: Strategy, Color: Color) {
        this.name = name;
        this.strategy = strategy;
        this.color = Color;
    }

    get colorizedName() {
        return this.color(this.name);
    }

    isUser() {
        return this.strategy instanceof UserInput;
    }
}

export default Player;
