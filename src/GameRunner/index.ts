import { GameSettings } from "./GameSettings";

class GameRunner {
    private settings: GameSettings;

    constructor() {
        this.settings = new GameSettings();
    }

    async setup() {
        await this.settings.setup();
    }

    async runGame() {
        const game = this.settings.createGame();
        await game.play(this.settings.timeDelay);
        console.log(game.endScreen());
    }
}

export default GameRunner;