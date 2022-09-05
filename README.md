# Cards in a line
#### Implementation of the coins in a line game in TypeScript
---
My ultimate goal is to write many strategies including:
* [x] Always First/Last
* [x] Choose Maximum
* [ ] Choose Odd/Even
* [ ] Different Greedy Strategies
* [x] Minimax
* [x] Random
* [ ] SameChoice
* [x] UserInput

---

## Example code:

#### Imports
```ts
import colors from "colors/safe";
import Card from "./Card";
import { CARD_SYMBOLS } from "./Constants";
import Game from "./Game";
import Player from "./Player";
import { ChooseMaximum, Minimax, Random, UserInput } from "./Strategies";
```

#### Initialize the board:
```ts
// Randomly generate the board
// The default card number is 52
const board = Game.generateCards(24);

// OR create it manually
const board = [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2].map((element: number) => new Card(element, CARD_SYMBOLS.CLUBS));
```

#### Initialize the players and their strategies:
```ts
const players = [
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Player 1", new UserInput(), colors.green),
    new Player("Bot 2", new ChooseMaximum(), colors.red),
    new Player("Bot 3", new Random(), colors.blue)
];
```
#### Initialize the game:
```ts
const game = new Game(players, board);
```
#### Launch the game:
```ts
(async () => {
    // Waits 1000 ms between each turn
    await game.play(1000);
    console.log(game.endScreen());
})();
```