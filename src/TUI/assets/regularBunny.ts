import path from "path";
import colors from "colors";
import { colorizeBunnyTemplate } from "./readBunny";
import { cowTemplateStats } from "./templateStats";
import { regularBunny } from "./regularBunny.json";

const regularBunnyStats: cowTemplateStats = {
    name: "regular bunny",
    skinColor: colors.reset,
    action: {
        symbol: "!",
        rows: [0, 1, 2],
        color: colors.reset,
    },
    eye: {
        symbol: "•",
        row: 2,
        color: colors.reset,
    },
    tongue: {
        symbol: "ㅅ",
        row: 2,
        color: colors.reset,
    },
    coloredLines: [0, 1, 2, 3],
};

function getRegularBunny(color?: colors.Color) {
    const stats: cowTemplateStats = (!color) ? regularBunnyStats : {
        ...regularBunnyStats,
        skinColor: color.bold,
        tongue: {
            ...regularBunnyStats.tongue,
            color,
        },
    };
    return colorizeBunnyTemplate(regularBunny.split("\n"), stats);
}

export {
    regularBunny,
    getRegularBunny,
    regularBunnyStats
};
