import { CHOICES } from "../Constants";
import Strategy from "../Strategy";

class AlwaysLast extends Strategy {
    name = "AlwaysLast";
    choice() {
        return CHOICES.LAST;
    }
}

export default AlwaysLast;