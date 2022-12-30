import Graphics from "../Graphics";
import { GameSettings } from "./GameSettings";
import Game from "../Game";

class GameRunner {
    private settings: GameSettings;
    private game: Game | null;

    constructor() {
        this.settings = new GameSettings();
        this.game = null;
    }

    async setup() {
        console.log(Graphics.banner);
        await this.settings.setup();
    }

    async runGame() {
        // const playAgain = await this.settings.askPlayAgain();
        do {
            console.clear();
            console.log(Graphics.banner);
            this.game = this.settings.createGame();
            await this.game.play(this.settings.timeDelay);
            console.log(this.game.endScreen() + "\n");
        } while (await this.settings.askPlayAgain());
    }
}

export default GameRunner;