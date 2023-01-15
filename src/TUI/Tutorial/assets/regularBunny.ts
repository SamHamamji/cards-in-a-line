import path from "path";
import colors from "colors";
import { readBunnyTemplate } from "./readBunny";
import { cowTemplateStats } from "./templateStats";
import settings from "../settings";

const stats: cowTemplateStats = {
    name: "regular bunny",
    skinColor: ((str: string) => {
        return colors.bold(settings.botStats.color(str));
    }) as colors.Color,
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
        color: settings.botStats.color,
    },
    coloredLines: [0, 1, 2, 3]
};

const bunnyFilePath = path.join(__dirname, "./regularBunny.txt");

const regularBunny = readBunnyTemplate(bunnyFilePath, stats);

export default regularBunny;
