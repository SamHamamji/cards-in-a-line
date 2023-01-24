import { Color } from "colors/index";
import colors from "colors/safe";
import Player from "../Game/Player";
import Strategies, { StrategyName } from "../Strategies";

type PlayerColor = typeof PlayerSettings.playerColors[number];

class PlayerSettings {
    name: string;
    strategy: StrategyName;
    color: PlayerColor;

    static readonly playerColors = [
        "red",
        "green",
        "blue",
        "yellow",
        "magenta",
        "cyan",
    ] as const;

    constructor(name: string, strategy: StrategyName, color: PlayerColor) {
        this.name = name;
        this.strategy = strategy;
        this.color = color;
    }

    get colorFunction(): Color {
        return colors[this.color] as Color;
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