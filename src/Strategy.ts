import { CHOICES } from "./Constants";
import Game from "./Game";

interface Strategy {
    name: string;
    choice(game: Game): (CHOICES | Promise<CHOICES>);
}


export default Strategy;