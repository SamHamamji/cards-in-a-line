import colors from "colors/safe";
import { StrategyName } from "../Strategies";

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
}

export default PlayerSettings;
export { PlayerColor };