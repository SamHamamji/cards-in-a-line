import { CHOICES } from "../Constants";
import Strategy from "../Strategy";


class Random extends Strategy {
    readonly firstProbability;
    readonly name;
    constructor(firstProbability = 0.5) {
        super();
        this.name = `Random: ${firstProbability}-${1 - firstProbability}`;
        this.firstProbability = firstProbability;
    }
    choice() {
        return Math.random() < this.firstProbability ? CHOICES.FIRST : CHOICES.LAST;
    }
}

export default Random;