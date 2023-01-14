import colors from "colors/safe";
import Game from "../Game";
import Player from "../Game/Player";
import Strategies, { StrategyName } from "../Strategies";
import TUI from "../TUI";
import { Action, ActionType } from "./Action";
import CardGenerator from "./CardGenerator";
import PlayerSettings, { PlayerColor } from "./PlayerSettings";
const inquirerPromise = import("inquirer");

export class GameSettings {
    players: PlayerSettings[];
    cardNumber: number;
    timeDelay: number;

    static readonly defaultPlayerNumber = 2;
    static readonly defaultStrategyName: StrategyName = "Minimax";
    static readonly defaultTimeDelay = 500;
    static readonly defaultCardNumber = 12;
    static readonly maxPlayerNameLength = 16;

    get humanPlayers(): number {
        return this.players.filter(player => player.isHuman()).length;
    }

    get botPlayers(): number {
        return this.players.filter(player => !player.isHuman()).length;
    }

    constructor() {
        this.players = [];
        this.cardNumber = GameSettings.defaultCardNumber;
        this.timeDelay = GameSettings.defaultTimeDelay;
    }

    [ActionType.AddHuman]() {
        const player = new PlayerSettings(
            `Player ${this.humanPlayers + 1}`,
            "UserInput",
            this.getNextColor(),
        );
        this.players.push(player);
    }

    [ActionType.AddBot]() {
        const player = new PlayerSettings(
            `Bot ${this.botPlayers + 1}`,
            GameSettings.defaultStrategyName,
            this.getNextColor(),
        );
        this.players.push(player);
    }

    private getNextColor() {
        return PlayerSettings.playerColors[this.players.length % PlayerSettings.playerColors.length];
    }

    [ActionType.DeletePlayer](action: Action): Action {
        this.players.splice(action.playerIndex!, 1);
        return { type: ActionType.EditSettings };
    }

    async [ActionType.EditCardNumber](): Promise<Action> {
        this.cardNumber = await TUI.promptForInteger(
            "Enter the new card number",
            false,
        );
        return { type: ActionType.EditSettings };
    }

    async [ActionType.EditPlayer](action: Action): Promise<Action> {
        const player = this.players[action.playerIndex!];
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ action: Action; }>({
            type: "list",
            name: "action",
            message: "Select an action",
            choices: [{
                name: `Edit name (${player.name})`,
                value: { type: ActionType.EditName, playerIndex: action.playerIndex }
            }, {
                name: `Edit color (${player.colorFunction(player.color)})`,
                value: { type: ActionType.EditColor, playerIndex: action.playerIndex }
            }, {
                name: `Edit strategy: (${player.strategy})`,
                value: { type: ActionType.EditStrategy, playerIndex: action.playerIndex }
            },
            await TUI.getLineSeparator(),
            {
                name: "Delete player",
                value: { type: ActionType.DeletePlayer, playerIndex: action.playerIndex }
            }, {
                name: "Save",
                value: { type: ActionType.EditSettings }
            }] as ({ name: string, value: Action })[],
            pageSize: Number.MAX_SAFE_INTEGER,
        });
        return input.action;
    }

    async [ActionType.EditColor](action: Action): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ color: PlayerColor; }>({
            type: "list",
            name: "color",
            message: "Choose a new color",
            choices: [
                ...PlayerSettings.playerColors.map(color => ({
                    name: colors[color](color),
                    value: color,
                })),
                await TUI.getLineSeparator(),
                {
                    name: "Cancel",
                    value: this.players[action.playerIndex!].color,
                },
            ],
            pageSize: Number.MAX_SAFE_INTEGER,
        });

        this.players[action.playerIndex!].color = input.color;

        return { type: ActionType.EditPlayer, playerIndex: action.playerIndex! };
    }

    async [ActionType.EditName](action: Action): Promise<Action> {
        const newName = await TUI.promptForString(
            "Enter a new name",
            GameSettings.maxPlayerNameLength,
            this.players[action.playerIndex!].name,
        );
        this.players[action.playerIndex!].name = newName;
        return { type: ActionType.EditPlayer, playerIndex: action.playerIndex! };
    }

    async [ActionType.EditStrategy](action: Action): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ strategyName: StrategyName; }>({
            type: "list",
            name: "strategyName",
            message: "Choose a new strategy",
            default: this.players[action.playerIndex!].strategy,
            choices: [
                ...Object.keys(Strategies).map(strategyName => ({
                    name: strategyName,
                    value: strategyName,
                })),
                await TUI.getLineSeparator(),
                {
                    name: "Cancel",
                    value: this.players[action.playerIndex!].strategy,
                },
            ],
            pageSize: Number.MAX_SAFE_INTEGER,
        });

        this.players[action.playerIndex!].strategy = input.strategyName;

        return { type: ActionType.EditPlayer, playerIndex: action.playerIndex! };
    }

    async [ActionType.EditSettings](): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ action: Action; }>({
            type: "list",
            name: "action",
            message: "Settings",
            choices: await this.settingsChoices(),
            pageSize: Number.MAX_SAFE_INTEGER,
        });
        return input.action;
    }

    async [ActionType.EditTimeDelay](): Promise<Action> {
        this.timeDelay = await TUI.promptForInteger(
            "Enter the new time delay in milliseconds",
            true,
        );
        return { type: ActionType.EditSettings };
    }

    [ActionType.SetupMultiPlayer](): Action {
        this.players = [];
        for (let i = 0; i < GameSettings.defaultPlayerNumber; i++) {
            this.AddHuman();
        }
        return { type: ActionType.StartGame };
    }

    [ActionType.SetupSinglePlayer](): Action {
        this.players = [];
        this.AddHuman();
        for (let i = 1; i < GameSettings.defaultPlayerNumber; i++) {
            this.AddBot();
        }
        return { type: ActionType.StartGame };
    }

    [ActionType.SetupCustom](): Action {
        return { type: ActionType.EditSettings };
    }

    private async settingsChoices() {
        const editPlayerChoices = this.players.map((player, index) => ({
            name: `Select ${player.colorFunction(player.name)}`,
            value: { type: ActionType.EditPlayer, playerIndex: index }
        }));

        const addingPlayerChoices = [{
            name: "Add Human",
            value: { type: ActionType.AddHuman }
        }, {
            name: "Add Bot",
            value: { type: ActionType.AddBot }
        }];

        const otherSettingChoices = [{
            name: `Edit card number (${this.cardNumber})`,
            value: { type: ActionType.EditCardNumber }
        }, {
            name: `Edit time delay (${this.timeDelay} ms)`,
            value: { type: ActionType.EditTimeDelay }
        }];

        const generalChoices = [...(this.canCreateGame() ? [{
            name: "Start",
            value: { type: ActionType.StartGame }
        }] : [await TUI.getTextSeparator("Start")]), {
            name: "Cancel",
            value: { type: ActionType.Home }
        }];

        return [
            ...(editPlayerChoices.length !== 0 ? [
                ...editPlayerChoices,
                await TUI.getLineSeparator(),
            ] : []),
            ...addingPlayerChoices,
            await TUI.getLineSeparator(),
            ...otherSettingChoices,
            await TUI.getLineSeparator(),
            ...generalChoices,
        ];
    }

    private canCreateGame() {
        return this.players.length > 1;
    }

    createGame(): Game {
        const board = CardGenerator.generateCards(this.cardNumber);
        const players = this.createPlayers();
        return new Game(players, board);
    }

    private createPlayers(): Player[] {
        return this.players.map(playerSetting =>
            playerSetting.createPlayer()
        );
    }
}

export default GameSettings;
