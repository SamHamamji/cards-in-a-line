import Game, { CHOICES } from "../Game";

type TieBreaker = (game: Game) => CHOICES;

// Chooses randomly
const randomTieBreaker: TieBreaker = (_game: Game, firstProbability = 0.5) =>
    (Math.random() < firstProbability) ? CHOICES.FIRST : CHOICES.LAST;

// Chooses the card with the highest value, or randomly if they are equal
const maximumTieBreaker: TieBreaker = (game: Game) => {
    const diff = game.board[game.range.first].value
        - game.board[game.range.last].value;
    return (diff > 0)
        ? CHOICES.FIRST
        : (diff < 0)
            ? CHOICES.LAST
            : randomTieBreaker(game);
};

export default TieBreaker;
export { randomTieBreaker, maximumTieBreaker };
