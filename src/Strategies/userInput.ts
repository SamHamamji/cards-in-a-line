import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

interface Input {
    choice: CHOICES;
}

const userInput: StrategyFunction = async (game) => {
    const inquirer = await (await import("inquirer")).default;
    const input = await inquirer.prompt<Input>({
        type: "list",
        name: "choice",
        message: `${game.currentPlayer.colorizedName}, which card do you want to pick?`,
        choices: [{
            value: CHOICES.FIRST,
            name: `First: ${game.board[game.range.first]}`
        }, {
            value: CHOICES.LAST,
            name: `Last: ${game.board[game.range.last]}`
        }]
    });
    return input.choice;
};
export default userInput;