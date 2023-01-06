import Game from "../Game";
import colors from "colors/safe";
import Utils from "./Utils";

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
        return game.players.map((player, index) => `${player.colorizedName}: ${game.scores[index]}`).join(" | ");
    }

    static arrowLine(game: Game) {
        if (game.history.length === 0) {
            return "";
        }
        const currentEvent = game.history[game.history.length - 1];
        return " ".repeat(4 * currentEvent.pickedCardIndex + 1) + game.players[currentEvent.playerIndex].colorize(colors.bold("^"));
    }

    static historyLine(game: Game) {
        const historyRepr = new Array(game.cardsNumber).fill("   ");
        game.history.forEach((element, time) => {
            historyRepr[element.pickedCardIndex] = ` ${(time + 1).toString().padEnd(2, " ")}`;
        });
        return colors.dim(historyRepr.join(" "));
    }

    static rankingLines(game: Game) {
        const podium = game.ranking().map((array, index) =>
            array.map(element => {
                const name = element.player.colorizedName;
                const strategyName = element.player.strategy.name;
                return `${index + 1}. ${name} (${strategyName}): ${element.score}`;
            }).join("\n")
        ).join("\n");
        return `Ranking:\n${podium}\n`;
    }
}

function clearScreen() {
    console.clear();
    console.log(colors.bold(Utils.banner));
}

async function showStartScreen() {
    clearScreen();
    const message = colors.blue("Press enter to start the game");
    console.log(Utils.centerText(message));
    await Utils.waitForEnter();
}

function printRoundScreen(game: Game) {
    clearScreen();
    const scores = colors.bold("Scores: ") + Component.scoresLine(game);
    const board = Component.boardLine(game);
    const arrow = Component.arrowLine(game);
    console.log([
        scores,
        Utils.addBorder([board, arrow].join("\n")),
    ].join("\n"));
}

async function showEndScreen(game: Game) {
    clearScreen();

    const boardScreen = Utils.addBorder(
        Component.boardLine(game) + "\n" +
        Component.historyLine(game)
    );

    console.log([
        "The game has ended",
        boardScreen,
        Component.rankingLines(game)
    ].join("\n"));

    console.log(colors.blue("Press enter to continue"));
    await Utils.waitForEnter();
}

export default {
    clearScreen,
    showStartScreen,
    printRoundScreen,
    showEndScreen,
    Utils,
};