import colors from "colors/safe";
import textEditing from "./textEditing";
const inquirerPromise = import("inquirer");

const separatorSymbol = "─";

async function getLineSeparator(isCentered = false, length = 14) {
    const separator = colors.gray(separatorSymbol.repeat(length));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? textEditing.centerText(separator) : separator
    );
}

async function getTextSeparator(text: string, isCentered = false) {
    const separator = colors.dim(textEditing.decolorize(text));
    return new (await inquirerPromise).default.Separator(
        (isCentered) ? textEditing.centerText(separator) : separator
    );
}

export default {
    getLineSeparator,
    getTextSeparator,
};