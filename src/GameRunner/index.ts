import GameSettings from "./GameSettings";
import Game from "../Game";
import TUI from "../TUI";
import { Action, ActionType } from "./Action";
const inquirerPromise = import("inquirer");

class GameRunner {
    private settings: GameSettings;
    private game: Game | null;
    private currentAction: Action | null;

    constructor() {
        this.settings = new GameSettings();
        this.currentAction = null;
        this.game = null;
    }

    async run() {
        this.currentAction = { type: ActionType.StartScreen };
        do {
            TUI.clearScreen();
            this.currentAction = await this[this.currentAction.type](this.currentAction);
        } while (this.currentAction !== null);
    }

    private [ActionType.AddBot](): Action {
        this.settings.AddBot();
        return { type: ActionType.GoHome };
    }

    private [ActionType.AddHuman](): Action {
        this.settings.AddHuman();
        return { type: ActionType.GoHome };
    }

    private async [ActionType.EditPlayer](action: Action): Promise<Action> {
        return await this.settings.EditPlayer(action);
    }

    private async [ActionType.EditColor](action: Action): Promise<Action> {
        return await this.settings.EditColor(action);
    }

    private async [ActionType.EditName](action: Action): Promise<Action> {
        return await this.settings.EditName(action);
    }

    private async [ActionType.EditStrategy](action: Action): Promise<Action> {
        return await this.settings.EditStrategy(action);
    }

    private [ActionType.DeletePlayer](action: Action): Action {
        return this.settings.DeletePlayer(action);
    }

    private async [ActionType.EditCardNumber](): Promise<Action> {
        return await this.settings.EditCardNumber();
    }

    private async [ActionType.GoHome](): Promise<Action> {
        return await this.settings.GoHome();
    }

    private async [ActionType.StartScreen](): Promise<Action> {
        await TUI.printStartScreen();
        return { type: ActionType.GoHome };
    }

    private async [ActionType.RunGame](): Promise<Action> {
        this.game = this.settings.createGame();
        await this.play(this.settings.timeDelay);
        return { type: ActionType.EndScreen };
    }

    private async [ActionType.StartGame](): Promise<Action> {
        if (!await TUI.Utils.confirm("Start game?"))
            return { type: ActionType.GoHome };
        return { type: ActionType.RunGame };
    }

    private async [ActionType.EndScreen](): Promise<Action> {
        TUI.printEndScreen(this.game!);
        if (await this.askPlayAgain())
            return { type: ActionType.RunGame };
        else
            return { type: ActionType.Exit };
    }

    private async [ActionType.Exit](): Promise<Action | null> {
        const confirmation = await TUI.Utils.confirm("Are you sure you want to exit?");
        if (!confirmation)
            return { type: ActionType.EndScreen };
        return null;
    }

    async play(timeDelay: number) {
        if (this.game === null)
            throw new Error("Game is not initialized");

        while (!this.game.isOver()) {
            TUI.printRoundScreen(this.game);
            if (!this.game.currentPlayer.isUser())
                await new Promise(resolve => setTimeout(resolve, timeDelay));
            await this.game.playOneRound();
        }
    }

    async askPlayAgain() {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ choice: boolean; }>({
            type: "confirm",
            name: "choice",
            message: "Play again?",
        });
        return input.choice;
    }
}

export default GameRunner;