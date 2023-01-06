import { GameSettings } from "./GameSettings";

enum GameType {
    SinglePlayer = "SinglePlayer",
    MultiPlayer = "MultiPlayer",
    Custom = "Custom"
}

const setupGameByType: Record<GameType, (settings: GameSettings) => void> = {
    [GameType.SinglePlayer]: (settings: GameSettings) => {
        settings.players = [];
        settings.AddHuman();
        for (let i = 1; i < GameSettings.defaultPlayerNumber; i++) {
            settings.AddBot();
        }
    },
    [GameType.MultiPlayer]: (settings: GameSettings) => {
        settings.players = [];
        for (let i = 0; i < GameSettings.defaultPlayerNumber; i++) {
            settings.AddHuman();
        }
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    [GameType.Custom]: () => { },
};

export { GameType, setupGameByType };