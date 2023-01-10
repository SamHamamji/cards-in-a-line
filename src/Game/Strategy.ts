import Game, { CHOICES } from "./index";

interface Strategy {
    name: string;
    choice(game: Game): (CHOICES | Promise<CHOICES>);
}

export default Strategy;