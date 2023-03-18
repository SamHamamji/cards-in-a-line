import { CHOICE } from "../index";
import Strategy from "../Strategy";

class AlwaysFirst implements Strategy {
    name = "AlwaysFirst";
    choice() {
        return CHOICE.FIRST;
    }
}

export default AlwaysFirst;