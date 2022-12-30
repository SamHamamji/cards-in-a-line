/* eslint-disable @typescript-eslint/no-unused-vars */

import colors from "colors/safe";
import Game from "../Game";
import Graphics from "../Graphics";
import Player from "../Player";
import Strategies, { StrategyName } from "../Strategies/index";
import { Action, ActionType } from "./Action";
import CardGenerator from "./CardGenerator";
import PlayerSettings, { PlayerColor } from "./PlayerSettings";
const inquirerPromise = import("inquirer");

export class GameSettings {
    players: PlayerSettings[];
    cardsNumber: number;
    timeDelay = 1000;

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
        for (let i = 0; i < GameSettings.defaultPlayerNumber; i++) {
            this.addPlayer(false);
        }
        this.cardsNumber = GameSettings.defaultCardNumber;
    }

    async setup() {
        let currentAction: Action | null = { type: ActionType.GoHome };
        do {
            currentAction = await this[currentAction.type](currentAction);
            console.clear();
            console.log(Graphics.banner);
        } while (currentAction !== null);
    }

    private async [ActionType.GoHome](action: Action): Promise<Action> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ action: Action; }>({
            type: "list",
            name: "action",
            message: "Setup the game",
            choices: async () => {
                const playerChoices = (this.players.map((player, index) => ({
                    name: `Select ${player.colorFunction(player.name)}`,
                    value: { type: ActionType.EditPlayer, playerIndex: index }
                })));
                const addChoices = [{
                    name: "Add Human",
                    value: { type: ActionType.AddHuman }
                }, {
                    name: "Add Bot",
                    value: { type: ActionType.AddBot }
                }];
                if (playerChoices.length === 0)
                    return addChoices;
                return [
                    ...playerChoices,
                    await GameSettings.createSeparator(),
                    ...addChoices,
                    await GameSettings.createSeparator(),
                    {
                        name: "Start",
                        value: { type: ActionType.Start }
                    },
                ];
            },
            loop: false,
            pageSize: Number.MAX_SAFE_INTEGER,
        });
        return input.action;
    }

    private async[ActionType.AddBot](action: Action): Promise<Action> {
        this.addPlayer(true);
        return { type: ActionType.GoHome };
    }

    private [ActionType.AddHuman](action: Action): Action {
        this.addPlayer(false);
        return { type: ActionType.GoHome };
    }

    private addPlayer(isBot: boolean) {
        const player = new PlayerSettings(
            isBot ?
                `Bot ${this.botPlayers + 1}` :
                `Player ${this.humanPlayers + 1}`,
            isBot ?
                "AlwaysFirst" :
                "UserInput",
            this.getNextColor()
        );
        this.players.push(player);
    }

    private getNextColor() {
        return PlayerSettings.playerColors[this.players.length % PlayerSettings.playerColors.length];
    }

    private async[ActionType.EditPlayer](action: Action): Promise<Action> {
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
            await GameSettings.createSeparator(),
            {
                name: "Delete player",
                value: { type: ActionType.DeletePlayer, playerIndex: action.playerIndex }
            }, {
                name: "Home",
                value: { type: ActionType.GoHome }
            }] as ({ name: string, value: Action })[],
            loop: false,
            pageSize: Number.MAX_SAFE_INTEGER,
        });
        return input.action;
    }

    private async[ActionType.EditName](action: Action): Promise<Action> {
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

    private async [ActionType.Start](action: Action): Promise<Action | null> {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ confirmed: boolean; }>({
            type: "confirm",
            name: "confirmed",
            message: "Start game?",
            default: true,
        });
        if (!input.confirmed)
            return { type: ActionType.GoHome };
        return null;
    }

    private async[ActionType.EditStrategy](action: Action): Promise<Action> {
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
                await GameSettings.createSeparator(),
                {
                    name: "Cancel",
                    value: this.players[action.playerIndex!].strategy,
                },
            ],
            loop: false,
            pageSize: Number.MAX_SAFE_INTEGER,
        });

        this.players[action.playerIndex!].strategy = input.strategyName;

        return { type: ActionType.EditPlayer, playerIndex: action.playerIndex! };
    }

    private async[ActionType.EditColor](action: Action): Promise<Action> {
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
                await GameSettings.createSeparator(),
                {
                    name: "Cancel",
                    value: this.players[action.playerIndex!].color,
                },
            ],
            loop: false,
            pageSize: Number.MAX_SAFE_INTEGER,
        });

        this.players[action.playerIndex!].color = input.color;

        return { type: ActionType.EditPlayer, playerIndex: action.playerIndex! };
    }

    private [ActionType.DeletePlayer](action: Action): Action {
        this.players.splice(action.playerIndex!, 1);
        return { type: ActionType.GoHome };
    }

    createGame(): Game {
        const board = CardGenerator.generateCards(this.cardsNumber);
        const players = this.createPlayers();
        return new Game(players, board);
    }

    private createPlayers(): Player[] {
        return this.players.map(playerSetting =>
            playerSetting.createPlayer()
        );
    }

    private static async createSeparator() {
        const separatorString = colors.gray("──────────────");
        return new (await inquirerPromise).default.Separator(separatorString);
    }

    async askPlayAgain() {
        const inquirer = (await inquirerPromise).default;
        const input = await inquirer.prompt<{ choice: boolean; }>({
            type: "confirm",
            name: "choice",
            message: "Play again?",
            // default: true,
        });
        return input.choice;
    }
}
