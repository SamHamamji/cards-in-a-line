import { CHOICES } from "../Constants";
import Strategy from "../Strategy";

class AlwaysFirst extends Strategy {
    name = "AlwaysFirst";
    choice() {
        return CHOICES.FIRST;
    }
}

export default AlwaysFirst;