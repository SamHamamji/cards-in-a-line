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
        return { type: ActionType.EditSettings };
    }

    private [ActionType.AddHuman](): Action {
        this.settings.AddHuman();
        return { type: ActionType.EditSettings };
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

    private async [ActionType.EditTimeDelay](): Promise<Action> {
        return this.settings.EditTimeDelay();
    }

    private [ActionType.DeletePlayer](action: Action): Action {
        return this.settings.DeletePlayer(action);
    }

    private async [ActionType.EditCardNumber](): Promise<Action> {
        return await this.settings.EditCardNumber();
    }

    private async [ActionType.EditSettings](): Promise<Action> {
        return await this.settings.EditSettings();
    }

    private async [ActionType.Home](): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ choice: Action }>({
            type: "list",
            name: "choice",
            message: "Select game type",
            choices: await GameRunner.getHomeChoices(),
            pageSize: Number.MAX_SAFE_INTEGER,
        });
        return input.choice;
    }

    private async [ActionType.RunGame](): Promise<Action> {
        this.game = this.settings.createGame();
        await this.play(this.settings.timeDelay);
        return { type: ActionType.EndScreen };
    }

    private [ActionType.SetupCustom](): Action {
        return this.settings.SetupCustom();
    }

    private [ActionType.SetupSinglePlayer](): Action {
        return this.settings.SetupSinglePlayer();
    }

    private [ActionType.SetupMultiPlayer](): Action {
        return this.settings.SetupMultiPlayer();
    }

    private async [ActionType.StartGame](): Promise<Action> {
        if (!await TUI.confirm("Start game?"))
            return { type: ActionType.Home };
        return { type: ActionType.RunGame };
    }

    private async [ActionType.StartScreen](): Promise<Action> {
        await TUI.showStartScreen();
        return { type: ActionType.Home };
    }

    private async [ActionType.EndScreen](): Promise<Action> {
        await TUI.showEndScreen(this.game!);
        return { type: ActionType.AskPlayAgain };
    }

    private async [ActionType.AskPlayAgain](): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ action: Action; }>({
            type: "list",
            name: "action",
            message: "Select an action:",
            choices: [{
                name: "Play again",
                value: { type: ActionType.RunGame },
            }, {
                name: "Home",
                value: { type: ActionType.Home },
            }, {
                name: "Exit",
                value: { type: ActionType.Exit },
            }],
        });
        return input.action;
    }

    private async [ActionType.Exit](): Promise<Action | null> {
        const confirmation = await TUI.confirm("Are you sure you want to exit?");
        if (!confirmation)
            return { type: ActionType.Home };
        return null;
    }

    private async [ActionType.Tutorial](): Promise<Action> {
        await TUI.showTutorial();
        return { type: ActionType.Home };
    }

    private static async getHomeChoices() {
        return [{
            name: TUI.centerText("🂸  Single Player  🂸"),
            value: { type: ActionType.SetupSinglePlayer }
        }, {
            name: TUI.centerText("🃓   MultiPlayer   🃓"),
            value: { type: ActionType.SetupMultiPlayer }
        }, {
            name: TUI.centerText("🃍   Custom game   🃍"),
            value: { type: ActionType.SetupCustom }
        }, await TUI.getLineSeparator(true, 20), {
            name: TUI.centerText("🂱    Tutorial     🂱"),
            value: { type: ActionType.Tutorial }
        }, {
            name: TUI.centerText("🂦      Exit       🂦"),
            value: { type: ActionType.Exit }
        }] as const;
    }

    async play(timeDelay: number) {
        if (this.game === null)
            throw new Error("Game is not initialized");

        while (!this.game.isOver()) {
            TUI.showRoundScreen(this.game);
            if (!this.game.currentPlayer.isUser())
                await TUI.showRoundScreenAndThink(
                    this.game, { time: timeDelay }
                );
            await this.game.playOneRound();
        }
    }
}

export default GameRunner;