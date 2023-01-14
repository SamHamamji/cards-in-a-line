import readline from "readline";
const inquirerPromise = import("inquirer");

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

async function promptForInteger(prompt: string, acceptsZero = true) {
    const inquirer = (await inquirerPromise).default;
    const input = await inquirer.prompt<{ num: number; }>({
        type: "number",
        name: "num",
        message: prompt,
        validate(str: string) {
            const num = Number.parseInt(str);
            if (Number.isNaN(num))
                return "Invalid format";
            if (num < 0 || (num === 0 && !acceptsZero))
                return "Enter a positive integer";
            return true;
        },
        filter(str: string) {
            const num = Number.parseInt(str);
            if (Number.isNaN(num))
                return "";
            if (num < 0 || (num === 0 && !acceptsZero))
                return num.toString();
            return str;
        },
    });
    return input.num;
}

async function promptForString(
    prompt: string,
    maxInputLength?: number,
    defaultString?: string
) {
    const inquirer = (await inquirerPromise).default;
    const input = await inquirer.prompt<{ str: string; }>({
        type: "input",
        name: "str",
        message: prompt,
        default: defaultString,
        validate(name: string) {
            const trimmed = name.trim();
            if (trimmed.length === 0)
                return "Input cannot be empty";
            if (!/^[\w\s]+$/.test(trimmed))
                return "Input can only contain alphanumerical characters";
            if (maxInputLength && trimmed.length > maxInputLength)
                return `Input length cannot exceed ${maxInputLength}`;
            return true;
        },
    });
    return input.str.trim();
}

async function waitForEnter(prompt?: string) {
    if (prompt !== undefined)
        console.log(prompt);
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

export default {
    confirm,
    promptForInteger,
    promptForString,
    waitForEnter,
};
