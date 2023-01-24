import { CowMooOptions } from "cowsayjs";
import { getRegularBunny } from "./assets/regularBunny";
import colors from "colors";

const attachingGap = 5;

const defaultCow = getRegularBunny(colors.reset);

const defaultSpeechOptions: CowMooOptions = {
    action: "say",
    cow: defaultCow,
    eyes: defaultCow.defEyes,
    tongue: defaultCow.defTongue,
    wrap: 28,
} as const;

interface thinkingStats {
    time: number;
    barLength: number;
    symbol: string;
}

const defaultThinkingStats: thinkingStats = {
    time: 2000,
    barLength: 3,
    symbol: ".",
} as const;

export {
    attachingGap,
    thinkingStats,
    defaultThinkingStats,
    defaultSpeechOptions,
};
