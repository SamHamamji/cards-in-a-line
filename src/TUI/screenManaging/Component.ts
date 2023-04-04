import Game from "../../Game";
import colors from "colors/safe";
import textProcessing from "../textProcessing";
import { defaultSpeechOptions } from "../constants";
import { CowMooOptions, moo } from "cowsayjs";

function boardLine(game: Game) {
    const boardRepr = new Array(game.cardsNumber).fill("   ");
    game.history.forEach(event => {
        boardRepr[event.pickedCardIndex] = game.players[event.playerIndex].color(event.pickedCard.toString());
    });
    for (let index = game.range.first; index <= game.range.last; index++) {
        boardRepr[index] = colors.dim(game.board[index].toString());
    }
    if (!game.isOver()) {
        [game.range.first, game.range.last].forEach(index => {
            boardRepr[index] = colors.bold(game.board[index].toString());
        });
    }
    return boardRepr.join(" ");
}

function scoresLine(game: Game) {
    return game.players.map((player, index) => `${player.colorizedName}: ${game.scores[index]}`
    ).join(" | ");
}

function arrowLine(game: Game) {
    if (game.history.length === 0)
        return "";
    const currentEvent = game.history[game.history.length - 1];
    return " ".repeat(4 * currentEvent.pickedCardIndex + 1) +
        game.players[currentEvent.playerIndex].color(colors.bold("^"));
}

function historyLine(game: Game) {
    const historyRepr: string[] = new Array(game.cardsNumber).fill("    ");
    game.history.forEach((event, time) => {
        historyRepr[event.pickedCardIndex] =
            " " + (time + 1).toString().padEnd(2, " ");
    });
    return colors.dim(historyRepr.join(" "));
}

function rankingLines(game: Game) {
    const podium = game.ranking().map((rank, index) => rank.map(element => {
        const name = element.player.colorizedName;
        const score = element.score;
        return `${index + 1}. ${name}: ${score}`;
    }).join("\n")
    ).join("\n");
    return `Ranking:\n${podium}\n`;
}

function roundScreen(game: Game) {
    const scores = colors.bold("Scores: ") + scoresLine(game);
    const board = boardLine(game);
    const arrow = arrowLine(game);
    return [
        scores,
        textProcessing.addBorder([board, arrow].join("\n")),
    ].join("\n");
}

function endScreen(game: Game) {
    const boardScreen = textProcessing.addBorder(
        boardLine(game) + "\n" +
        historyLine(game)
    );

    return [
        "The game has ended",
        boardScreen,
        rankingLines(game)
    ].join("\n");
}

function say(
    speech: string,
    options: CowMooOptions = {}
) {
    return moo(speech, {
        ...defaultSpeechOptions,
        ...options,
    });
}

export default {
    boardLine,
    scoresLine,
    arrowLine,
    historyLine,
    rankingLines,
    roundScreen,
    endScreen,
    say,
};
