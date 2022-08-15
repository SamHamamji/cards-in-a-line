import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const alwaysFirst: StrategyFunction = () => CHOICES.FIRST;
export default alwaysFirst;