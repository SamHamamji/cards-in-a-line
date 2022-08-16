import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysFirst: StrategyFunction = async () => {
    return CHOICES.FIRST;
};
export default alwaysFirst;