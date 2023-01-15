import colors from "colors";
import { StrategyName } from "../../Strategies/index";

const cardNumber = 12;

const userColor = colors.red;
const maxNameLength = 16;

const botStats = {
    name: "Robbie",
    botStrategy: "ChooseMaximum" as StrategyName,
    color: colors.yellow as colors.Color,
} as const;

const thinkingStats = {
    time: 1500,
    barLength: 3,
    symbol: ".",
} as const;

const attachingGap = 5;
const speechWrap = 28;

export default {
    cardNumber,
    userColor,
    maxNameLength,
    botStats,
    thinkingStats,
    attachingGap,
    speechWrap,
};