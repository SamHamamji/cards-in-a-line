import colors from "colors/safe";
import { StrategyName } from "../../Strategies/index";

const cardNumber = 12;
const userColor = colors.red;

const botStats = {
    name: "Robbie",
    botStrategy: "ChooseMaximum" as StrategyName,
    color: colors.green,
};

const attachingGap = 5;

const maxNameLength = 16;

const thinkingStats = {
    time: 1500,
    barLength: 3,
    symbol: ".",
} as const;

export default {
    cardNumber,
    userColor,
    botStats,
    attachingGap,
    maxNameLength,
    thinkingStats,
};