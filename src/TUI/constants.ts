import { CowMooOptions } from "cowsayjs";
import { getRegularBunny } from "./assets/regularBunny";
import colors from "colors";

const attachingGap = 5;

const defaultCow = getRegularBunny(colors.white);

const defaultSpeechOptions: CowMooOptions = {
    action: "say",
    cow: defaultCow,
    eyes: defaultCow.defEyes,
    tongue: defaultCow.defTongue,
    wrap: 28,
};

const thinkingStats = {
    time: 1500,
    barLength: 3,
    symbol: ".",
} as const;

export {
    attachingGap,
    thinkingStats,
    defaultSpeechOptions,
};