import Game from "../Game/index";
import colors from "colors/safe";
import banner from "./banner";
import inputCalling from "./inputCalling";
import textProcessing from "./textProcessing";

class Component {
    static boardLine(game: Game) {
        const boardRepr = new Array(game.cardsNumber).fill("   ");
        game.history.forEach(event => {
            boardRepr[event.pickedCardIndex] = game.players[event.playerIndex].colorize(event.pickedCard.toString());
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

    static scoresLine(game: Game) {
        return game.players.map((player, index) =>
            `${player.colorizedName}: ${game.scores[index]}`
        ).join(" | ");
    }

    static arrowLine(game: Game) {
        if (game.history.length === 0)
            return "";
        const currentEvent = game.history[game.history.length - 1];
        return " ".repeat(4 * currentEvent.pickedCardIndex + 1) +
            game.players[currentEvent.playerIndex].colorize(colors.bold("^"));
    }

    static historyLine(game: Game) {
        const historyRepr: string[] = new Array(game.cardsNumber).fill("    ");
        game.history.forEach((event, time) => {
            historyRepr[event.pickedCardIndex] =
                " " + (time + 1).toString().padEnd(2, " ");
        });
        return colors.dim(historyRepr.join(" "));
    }

    static rankingLines(game: Game) {
        const podium = game.ranking().map((rank, index) =>
            rank.map(element => {
                const name = element.player.colorizedName;
                const strategy = element.player.strategy.name;
                const score = element.score;
                return `${index + 1}. ${name} (${strategy}): ${score}`;
            }).join("\n")
        ).join("\n");
        return `Ranking:\n${podium}\n`;
    }
}

function clearScreen() {
    console.clear();
    console.log(colors.bold(banner));
}

async function showStartScreen() {
    clearScreen();
    const message = colors.blue("Press enter to start the game");
    await inputCalling.waitForEnter(textProcessing.centerText(message));
}

function showRoundScreen(game: Game) {
    clearScreen();
    console.log(getRoundScreen(game));
}

function getRoundScreen(game: Game) {
    const scores = colors.bold("Scores: ") + Component.scoresLine(game);
    const board = Component.boardLine(game);
    const arrow = Component.arrowLine(game);
    return [
        scores,
        textProcessing.addBorder([board, arrow].join("\n")),
    ].join("\n");
}

async function showEndScreen(game: Game) {
    clearScreen();
    console.log(getEndScreen(game));
    await inputCalling.waitForEnter(colors.blue("Press enter to continue"));
}

function getEndScreen(game: Game) {
    const boardScreen = textProcessing.addBorder(
        Component.boardLine(game) + "\n" +
        Component.historyLine(game)
    );

    return [
        "The game has ended",
        boardScreen,
        Component.rankingLines(game)
    ].join("\n");
}

export default {
    clearScreen,
    showStartScreen,
    showRoundScreen,
    showEndScreen,
    getRoundScreen,
    getEndScreen,
};
