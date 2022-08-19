import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysFirst: StrategyFunction = () => {
    return CHOICES.FIRST;
};
export default alwaysFirst;