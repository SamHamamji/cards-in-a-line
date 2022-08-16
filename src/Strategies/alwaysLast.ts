import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysLast: StrategyFunction = async () => {
    return CHOICES.LAST;
};
export default alwaysLast;