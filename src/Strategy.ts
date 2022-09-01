import { CHOICES } from "./Constants";
import Game from "./Game";

abstract class Strategy {
    abstract name: string;
    abstract choice(game: Game): (CHOICES | Promise<CHOICES>);
}


export default Strategy;