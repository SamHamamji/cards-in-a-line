import AlwaysFirst from "./AlwaysFirst";
import AlwaysLast from "./AlwaysLast";
import Random from "./Random";
import UserInput from "./UserInput";
import ChooseMaximum from "./ChooseMaximum";
import Minimax from "./Minimax";

const Strategies = {
    AlwaysFirst,
    AlwaysLast,
    Random,
    UserInput,
    ChooseMaximum,
    Minimax,
};

export type StrategyName = keyof typeof Strategies

export default Strategies;