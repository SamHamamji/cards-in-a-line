import GameSettings from "./GameSettings";
import Game from "../Game";
import TUI from "../TUI";

class GameRunner {
    private settings: GameSettings;
    private game: Game | null;

    constructor() {
        this.settings = new GameSettings();
        this.game = null;
    }

    async setup() {
        await this.settings.setup();
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

    async runGame() {
        do {
            this.game = this.settings.createGame();
            await this.play(this.settings.timeDelay);
            TUI.printEndScreen(this.game);
        } while (await this.settings.askPlayAgain());
    }
}

export default GameRunner;