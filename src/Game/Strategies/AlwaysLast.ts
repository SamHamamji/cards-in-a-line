import { CHOICE } from "../index";
import Strategy from "../Strategy";

class AlwaysLast implements Strategy {
    name = "AlwaysLast";
    choice() {
        return CHOICE.LAST;
    }
}

export default AlwaysLast;