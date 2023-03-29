import AlwaysFirst from "./AlwaysFirst";
import AlwaysLast from "./AlwaysLast";
import ChooseMaximum from "./ChooseMaximum";
import Clone from "./Clone";
import Minimax from "./Minimax";
import Mystery from "./Mystery";
import Random from "./Random";
import UserInput from "./UserInput";

const Strategies = {
    AlwaysFirst,
    AlwaysLast,
    ChooseMaximum,
    Clone,
    Minimax,
    Mystery,
    Random,
    UserInput,
};

type StrategyName = keyof typeof Strategies;

export default Strategies;
export { Strategies, StrategyName };
