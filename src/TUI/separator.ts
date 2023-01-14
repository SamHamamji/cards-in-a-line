import colors from "colors/safe";
import textProcessing from "./textProcessing";
const inquirerPromise = import("inquirer");

const separatorSymbol = "─";

async function getLineSeparator(isCentered = false, length = 14) {
    const separator = colors.gray(separatorSymbol.repeat(length));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? textProcessing.centerText(separator) : separator
    );
}

async function getTextSeparator(text: string, isCentered = false) {
    const separator = colors.dim(textProcessing.decolorize(text));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? textProcessing.centerText(separator) : separator
    );
}

export default {
    getLineSeparator,
    getTextSeparator,
};