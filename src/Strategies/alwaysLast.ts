import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysLast: StrategyFunction = () => CHOICES.LAST;
export default alwaysLast;