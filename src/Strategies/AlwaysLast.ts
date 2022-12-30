import { CHOICES } from "../Game";
import Strategy from "../Strategy";

class AlwaysLast implements Strategy {
    name = "AlwaysLast";
    choice() {
        return CHOICES.LAST;
    }
}

export default AlwaysLast;