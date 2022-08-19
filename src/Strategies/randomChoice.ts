import { CHOICES } from "../Constants";
import { StrategyFunction } from "../types";

const randomChoice: StrategyFunction = () => {
    return Math.random() < 0.5 ? CHOICES.FIRST : CHOICES.LAST;
};
export default randomChoice;