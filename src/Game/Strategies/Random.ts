import { CHOICE } from "../index";
import Strategy from "../Strategy";

class Random implements Strategy {
    readonly firstProbability;
    readonly name;
    constructor(firstProbability = 0.5) {
        this.name = `Random: ${firstProbability}-${1 - firstProbability}`;
        this.firstProbability = firstProbability;
    }
    choice() {
        return Math.random() < this.firstProbability ? CHOICE.FIRST : CHOICE.LAST;
    }
}

export default Random;