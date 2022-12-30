import colors from "colors/safe";
import Player from "../Player";
import Strategies, { StrategyName } from "../Strategies/index";

type PlayerColor = typeof PlayerSettings.playerColors[number];

class PlayerSettings {
    name: string;
    strategy: StrategyName;
    color: PlayerColor;

    static readonly playerColors = [
        "red",
        "blue",
        "yellow",
        "green",
        "cyan",
        "magenta",
    ] as const;

    constructor(name: string, strategy: StrategyName, color: PlayerColor) {
        this.name = name;
        this.strategy = strategy;
        this.color = color;
    }

    get colorFunction() {
        return colors[this.color];
    }

    isHuman() {
        return this.strategy === "UserInput";
    }

    createPlayer() {
        return new Player(
            this.name,
            new Strategies[this.strategy],
            this.colorFunction,
        );
    }
}

export default PlayerSettings;
export { PlayerColor };