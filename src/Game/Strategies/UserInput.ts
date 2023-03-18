import Game, { CHOICE } from "../index";
import Strategy from "../Strategy";
const inquirer = import("inquirer");

interface Input {
    choice: CHOICE;
}

class UserInput implements Strategy {
    readonly name = "UserInput";

    async choice(game: Game) {
        const input = await (await inquirer).default.prompt<Input>({
            type: "list",
            name: "choice",
            message: `${game.currentPlayer.colorizedName}, which card do you want to pick?`,
            choices: [{
                value: CHOICE.FIRST,
                name: `First: ${game.board[game.range.first]}`
            }, {
                value: CHOICE.LAST,
                name: `Last: ${game.board[game.range.last]}`
            }]
        });
        return input.choice;
    }
}


export default UserInput;