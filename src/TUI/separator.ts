import colors from "colors/safe";
import { centerText, decolorize } from "./textProcessing";
const inquirerPromise = import("inquirer");

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

export {
    getLineSeparator,
    getTextSeparator,
};