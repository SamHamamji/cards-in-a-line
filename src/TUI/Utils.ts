import colors from "colors/safe";
import fs from "fs";
import path from "path";
import readline from "readline";
const inquirerPromise = import("inquirer");

const bannerPath = "./banner.txt";

const banner = fs.readFileSync(
    path.join(__dirname, bannerPath),
    { encoding: "utf-8", flag: "r" }
);

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

function centerText(str: string): string {
    const center = banner.split("\n").map(line =>
        line.length
    ).reduce((a, b) => Math.max(a, b), Number.MIN_SAFE_INTEGER) / 2;
    const leftIndex = Math.max(0, center - (decolorize(str).length / 2));
    return " ".repeat(leftIndex) + str;
}

const separatorSymbol = "─";

async function getLineSeparator(isCentered = false, length = 14) {
    const separator = colors.gray(separatorSymbol.repeat(length));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? centerText(separator) : separator
    );
}

async function getTextSeparator(text: string, isCentered = false) {
    const separator = colors.dim(decolorize(text));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? centerText(separator) : separator
    );
}


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

async function waitForEnter() {
    const inputListener = readline.createInterface({
        input: process.stdin,
    });
    await new Promise<void>(resolve => {
        inputListener.on("line", () => {
            inputListener.close();
            resolve();
        });
    });
}

async function confirm(prompt: string) {
    const inquirer = (await inquirerPromise).default;
    const input = await inquirer.prompt<{ confirmed: boolean; }>({
        type: "confirm",
        name: "confirmed",
        message: prompt,
        default: true,
    });
    return input.confirmed;
}

export default {
    addBorder,
    banner,
    centerText,
    getLineSeparator,
    getTextSeparator,
    confirm,
    waitForEnter
};