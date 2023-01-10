import { CHOICES } from "../Game";
import Strategy from "../Game/Strategy";

class AlwaysLast implements Strategy {
    name = "AlwaysLast";
    choice() {
        return CHOICES.LAST;
    }
}

export default AlwaysLast;