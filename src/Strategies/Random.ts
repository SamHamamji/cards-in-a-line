import { CHOICES } from "../Game";
import Strategy from "../Game/Strategy";

class Random implements Strategy {
    readonly firstProbability;
    readonly name;
    constructor(firstProbability = 0.5) {
        this.name = `Random: ${firstProbability}-${1 - firstProbability}`;
        this.firstProbability = firstProbability;
    }
    choice() {
        return Math.random() < this.firstProbability ? CHOICES.FIRST : CHOICES.LAST;
    }
}

export default Random;