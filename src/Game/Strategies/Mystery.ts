import Game, { CHOICE } from "../index";
import Strategy from "../Strategy";
import { Strategies } from "./index";


function getAvailableStrategies() {
    const unavailable = {
        Mystery: Strategies.Mystery,
        UserInput: Strategies.UserInput,
    };
    type unavailable = keyof Pick<typeof Strategies, keyof typeof unavailable>;
    const available = Object.values(Strategies);
    Object.values(unavailable).forEach((unavailableStrategy) => {
        available.splice(available.indexOf(unavailableStrategy, 1));
    });
    return available as (typeof Strategies)[keyof Omit<typeof Strategies, unavailable>][];
}


class Mystery implements Strategy {
    readonly name;
    private strategy: Strategy;
    private static available: (typeof Strategies)[keyof typeof Strategies][];

    constructor() {
        this.name = "Mystery";
        this.strategy = Mystery.chooseRandomStrategy();
        console.log(this.strategy.name);
    }

    async choice(game: Game) {
        return await this.strategy.choice(game);
    }

    static chooseRandomStrategy() {
        if (!Mystery.available) {
            Mystery.available = getAvailableStrategies();
        }
        return new Mystery.available[Math.floor(Math.random() * Mystery.available.length)]();
    }
}

export default Mystery;