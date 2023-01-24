import Game from "../Game";
import colors from "colors/safe";
import banner from "./assets/banner";
import inputCalling from "./inputCalling";
import textProcessing from "./textProcessing";
import { attachingGap, defaultSpeechOptions, thinkingStats } from "./constants";
import { CowMooOptions, moo } from "cowsayjs";
import { Cow } from "cowsayjs/cows/index";

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

    static roundScreen(game: Game) {
        const scores = colors.bold("Scores: ") + Component.scoresLine(game);
        const board = Component.boardLine(game);
        const arrow = Component.arrowLine(game);
        return [
            scores,
            textProcessing.addBorder([board, arrow].join("\n")),
        ].join("\n");
    }

    static endScreen(game: Game) {
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

    static say(
        speech: string,
        options: CowMooOptions = {},
    ) {
        return moo(speech, {
            ...defaultSpeechOptions,
            ...options,
        });
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
    console.log(Component.roundScreen(game));
}

async function showEndScreen(game: Game) {
    clearScreen();
    console.log(Component.endScreen(game));
    await inputCalling.waitForEnter(colors.blue("Press enter to continue"));
}

async function showEndScreenSayAndWait(
    game: Game,
    speech: string,
    prompt: string,
    options: CowMooOptions = {},
) {
    clearScreen();
    console.log(textProcessing.attach(attachingGap,
        Component.endScreen(game),
        [
            Component.say(speech, options),
            prompt,
        ].join("\n")
    ));
    await inputCalling.waitForEnter();
}

async function showRoundScreenSayAndWait(
    game: Game,
    speech: string,
    prompt: string,
    options: CowMooOptions = {},
) {
    clearScreen();
    console.log(textProcessing.attach(attachingGap,
        Component.roundScreen(game),
        [
            Component.say(speech, options),
            prompt,
        ].join("\n")
    ));
    await inputCalling.waitForEnter();
}

function showRoundScreenAndSay(
    game: Game,
    speech: string,
    options: CowMooOptions = {},
) {
    clearScreen();
    console.log(textProcessing.attach(attachingGap,
        Component.roundScreen(game),
        Component.say(speech, options)
    ));
}

async function showRoundScreenAndThink(
    game: Game,
    {
        cow = defaultSpeechOptions.cow as Cow,
        time = thinkingStats.time,
        barLength = thinkingStats.barLength,
        symbol = thinkingStats.symbol,
    }: {
        cow?: Cow,
        time?: number,
        barLength?: number,
        symbol?: string,
    } = {},
) {
    for (let i = 0; i <= barLength; i++) {
        await new Promise(resolve => {
            showRoundScreenAndSay(
                game,
                "Thinking" + symbol.repeat(i),
                { action: "think", cow }
            );
            setTimeout(resolve, time / barLength);
        });
    }
}

function showSpeech(
    speech: string,
    options: CowMooOptions = {},
) {
    clearScreen();
    console.log(Component.say(speech, options));
}

async function showSpeechAndWait(
    speech: string,
    prompt: string,
    options: CowMooOptions = {},
) {
    showSpeech(speech, options);
    await inputCalling.waitForEnter(prompt);
}

export default {
    clearScreen,
    showSpeech,
    showSpeechAndWait,
    showStartScreen,
    showRoundScreen,
    showRoundScreenAndSay,
    showRoundScreenAndThink,
    showRoundScreenSayAndWait,
    showEndScreen,
    showEndScreenSayAndWait,
};
