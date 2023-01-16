import banner from "./banner";

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

function centerText(str: string, base = banner): string {
    const center = getTextCenter(base);
    const leftIndex = Math.max(0, center - (decolorize(str).length / 2));
    return " ".repeat(leftIndex) + str;
}

function getTextCenter(str: string) {
    return Math.max(
        ...str.split("\n").map(
            line => line.length
        )
    ) / 2;
}

function decolorize(str: string): string {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\u001b\[.*?m/g, "");
}

/**
 * @returns the string representing the elements of `texts` attached to 
 * the right of one another, in the order in which they appear
 */
function attach(gapWidth: number, ...texts: string[]): string {
    if (texts.length === 0)
        throw new Error("Texts should contain at least one string");
    if (gapWidth < 0 || !Number.isInteger(gapWidth))
        throw new Error("gapWidth must be a positive integer");

    let result = texts[0];

    for (let index = 1; index < texts.length; index++) {
        result = attachHelper(gapWidth, result, texts[index]);
    }
    return result;
}

/**
 * @assumes that b has less lines than a 
 */
function attachHelper(gapWidth: number, a: string, b: string) {
    const lines = padArrays(
        a.split("\n"),
        b.split("\n"),
    );

    const gapX = Math.max(...lines.a.map(line => decolorize(line).length)) + gapWidth;
    return lines.a.map((line, y) =>
        line.padEnd(gapX + line.length - decolorize(line).length, " ") + lines.b[y]
    ).join("\n");
}

/**
 * @returns identical arrays but with the same length, bby padding the shortest 
 * one with empty strings
 */
function padArrays(a: string[], b: string[]) {
    const lengthDiff = b.length - a.length;
    const padded = {
        a,
        b,
    };
    for (let i = 0; i < Math.abs(lengthDiff); i++) {
        (lengthDiff > 0 ? padded.a : padded.b).push("");
    }
    return padded;
}

export default {
    addBorder,
    attach,
    BORDERS,
    centerText,
    decolorize,
};