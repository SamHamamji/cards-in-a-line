# Cards in a line  

Variant of the coins in a line game using cards, written in Typescript and using node.

## Quick start

### Setup
```sh
npm install
```

### Running
```sh
npm start
```

## Example code

### Imports
```ts
import colors from "colors/safe";
import Game from "./Game";
import Player from "./Player";
import { Minimax, Random, UserInput } from "./Strategies";
```

### Initialize the board:
```ts
const cardsNumber = 12;
const board = Game.generateCards(cardsNumber);
```

### Initialize the players and their strategies:
```ts
const players = [
    new Player("Bot 1", new Minimax(), colors.yellow),
    new Player("Player 1", new UserInput(), colors.red),
    new Player("Bot 2", new Random(), colors.blue),
    new Player("Player 2", new UserInput(), colors.green),
];
```

### Initialize the game:
```ts
const game = new Game(players, board);
```

### Launch the game:
```ts
const timeDelay = 1000;
await game.play(timeDelay);
```

## License
Licensed under the [GNU General Public License v3.0](LICENSE) license.