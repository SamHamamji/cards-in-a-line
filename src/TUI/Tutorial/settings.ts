import colors from "colors";
import { StrategyName } from "../../Game/Strategies/index";

const cardNumber = 12;

const userColor = colors.red;
const maxNameLength = 16;

const botStats = {
    name: "Robbie",
    botStrategy: "ChooseMaximum" as StrategyName,
    color: colors.yellow as colors.Color,
} as const;

export default {
    cardNumber,
    userColor,
    maxNameLength,
    botStats,
};