import banner from "./Banner";

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


function centerText(str: string): string {
    const center = banner.banner.split("\n").map(line => line.length
    ).reduce((a, b) => Math.max(a, b), Number.MIN_SAFE_INTEGER) / 2;
    const leftIndex = Math.max(0, center - (decolorize(str).length / 2));
    return " ".repeat(leftIndex) + str;
}

function decolorize(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[.*?m/g, "");
}

export default {
    centerText,
    decolorize,
    BORDERS,
    addBorder,
};