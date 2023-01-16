import { CowMooOptions } from "cowsayjs";
import regularBunny from "./Tutorial/assets/regularBunny";

const attachingGap = 5;

const defaultCow = regularBunny;

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