import Game, { CHOICES } from "../Game";
import Strategy from "../Game/Strategy";
const inquirer = import("inquirer");

interface Input {
    choice: CHOICES;
}

class UserInput implements Strategy {
    readonly name = "UserInput";

    async choice(game: Game) {
        const input = await (await inquirer).default.prompt<Input>({
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
    }
}


export default UserInput;