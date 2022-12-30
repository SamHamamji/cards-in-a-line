import fs from "fs";
import { bold } from "colors/safe";

const banner = bold(fs.readFileSync(
    "./src/Graphics/banner.txt",
    { encoding: "utf-8", flag: "r" }
));

interface Border {
    top: string;
    left: string;
    bottom: string;
    right: string;
    topLeft: string;
    topRight: string;
    bottomRight: string;
    bottomLeft: string;
}

const BORDERS = {
    ROUND: {
        top: "─",
        left: "│",
        bottom: "─",
        right: "│",
        topLeft: "╭",
        topRight: "╮",
        bottomRight: "╯",
        bottomLeft: "╰"
    },
    SHARP: {
        top: "─",
        left: "│",
        bottom: "─",
        right: "│",
        topLeft: "┌",
        topRight: "┐",
        bottomRight: "┘",
        bottomLeft: "└"
    }
};

function decolorize(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[.*?m/g, "");
}

function addBorder(str: string, border: Border = BORDERS.ROUND): string {
    const lines = str.split("\n");
    const width = Math.max(...lines.map(element => decolorize(element).length));

    const topLine = border.topLeft
        + border.top.repeat(width)
        + border.topRight + "\n";
    const bottomLine = "\n" +
        border.bottomLeft +
        border.bottom.repeat(width) +
        border.bottomRight;

    return topLine + lines.map(line =>
        border.left +
        line.padEnd(width + (line.length - decolorize(line).length)) +
        border.right
    ).join("\n") +
        bottomLine;
}


export default { banner, decolorize, addBorder };