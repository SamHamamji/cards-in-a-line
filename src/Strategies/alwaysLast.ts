import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysLast: StrategyFunction = () => {
    return CHOICES.LAST;
};
export default alwaysLast;