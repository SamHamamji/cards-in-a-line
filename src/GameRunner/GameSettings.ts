import colors from "colors/safe";
import Game from "../Game";
import Player from "../Player";
import Strategies, { StrategyName } from "../Strategies";
import TUI from "../TUI/index";
import { Action, ActionType } from "./Action";
import CardGenerator from "./CardGenerator";
import { GameType, setupGameByType } from "./GameType";
import PlayerSettings, { PlayerColor } from "./PlayerSettings";
const inquirerPromise = import("inquirer");

export class GameSettings {
    players: PlayerSettings[];
    cardNumber: number;
    timeDelay = 500;
    gameType: GameType | null;

    static readonly defaultStrategyName: StrategyName = "Minimax";
    static readonly defaultPlayerNumber = 2;
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
        this.gameType = null;
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
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ cardNumber: number; }>({
            type: "number",
            name: "cardNumber",
            message: "Enter new card number",
            validate(cardNumber: number) {
                if (!cardNumber || cardNumber <= 0)
                    return "Enter a positive integer";
                return true;
            },
            filter(cardNumber: number) {
                if (Number.isNaN(cardNumber))
                    return "";
                if (!Number.isInteger(cardNumber))
                    return "";
                if (cardNumber <= 0)
                    return "";
                return cardNumber;
            },
        });
        this.cardNumber = input.cardNumber;
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
            await TUI.Utils.getLineSeparator(),
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
                await TUI.Utils.getLineSeparator(),
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
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ name: string; }>({
            type: "input",
            name: "name",
            message: "Enter a new name",
            default: this.players[action.playerIndex!].name,
            validate(name: string) {
                const trimmed = name.trim();
                if (trimmed.length === 0)
                    return "Name cannot be empty";
                if (!/^[\w\s]+$/.test(trimmed))
                    return "Name can only contain alphanumerical characters";
                if (trimmed.length > GameSettings.maxPlayerNameLength)
                    return `Name length cannot exceed ${GameSettings.maxPlayerNameLength}`;
                return true;
            },
        });
        this.players[action.playerIndex!].name = input.name.trim();
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
                await TUI.Utils.getLineSeparator(),
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

    [ActionType.SetupSettings](): Action {
        if (this.gameType === null)
            throw new Error("gameType is not initialized");

        setupGameByType[this.gameType](this);

        return {
            type: (this.gameType === GameType.Custom) ?
                ActionType.EditSettings :
                ActionType.StartGame
        };
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
        }];

        const generalChoices = [...(this.canCreateGame() ? [{
            name: "Start",
            value: { type: ActionType.StartGame }
        }] : [await TUI.Utils.getTextSeparator("Start")]), {
            name: "Cancel",
            value: { type: ActionType.Home }
        }];

        return [
            ...(editPlayerChoices.length !== 0 ? [
                ...editPlayerChoices,
                await TUI.Utils.getLineSeparator(),
            ] : []),
            ...addingPlayerChoices,
            await TUI.Utils.getLineSeparator(),
            ...otherSettingChoices,
            await TUI.Utils.getLineSeparator(),
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
export { GameType };
