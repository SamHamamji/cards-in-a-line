import Game, { CHOICE } from "./index";

interface Strategy {
    name: string;
    choice(game: Game): (CHOICE | Promise<CHOICE>);
}

type TieBreaker = (game: Game) => CHOICE;

// Chooses randomly
const randomTieBreaker: TieBreaker = (_game: Game, firstProbability = 0.5) =>
    (Math.random() < firstProbability) ? CHOICE.FIRST : CHOICE.LAST;

// Chooses the card with the highest value, or randomly if they are equal
const maximumTieBreaker: TieBreaker = (game: Game) => {
    const diff = game.board[game.range.first].value
        - game.board[game.range.last].value;
    return (diff > 0)
        ? CHOICE.FIRST
        : (diff < 0)
            ? CHOICE.LAST
            : randomTieBreaker(game);
};

export default Strategy;
export { TieBreaker, randomTieBreaker, maximumTieBreaker };
