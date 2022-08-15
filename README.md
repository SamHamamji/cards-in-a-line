# Cards in a line
### Implementation of the coins in a line game in typescript
---
My ultimate goal is to write many strategies including:
 * Minimax
 * Different Greedy Strategies
 * Random
 * SameChoice
---
### Example code:

```ts
import { CHOICES } from "./Constants";
import Game from "./Game";
import Player, { StrategyFunction } from "./Player";

// The default card number is 52
const board = Game.generateCards(20);

const alwaysFirst: StrategyFunction = (game) => CHOICES.FIRST;
const alwaysLast: StrategyFunction = (game) => CHOICES.LAST;

const game = new Game([
    new Player("Player 1", alwaysFirst),
    new Player("Player 2", alwaysLast)
], board);

game.play();

console.log(game.toString());
console.log(game.scores);
console.log(game.history);
```