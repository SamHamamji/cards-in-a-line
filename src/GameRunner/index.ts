import Graphics from "../Graphics/index";
import { GameSettings } from "./GameSettings";

class GameRunner {
    private settings: GameSettings;

    constructor() {
        this.settings = new GameSettings();
    }

    async setup() {
        console.log(Graphics.banner);
        await this.settings.setup();
    }

    async runGame() {
        const game = this.settings.createGame();
        await game.play(this.settings.timeDelay);
        console.log(game.endScreen());
    }
}

export default GameRunner;