import Game from "../../Game";
import colors from "colors/safe";
import banner from "../assets/banner";
import inputCalling from "../inputCalling";
import { attach, centerText } from "../textProcessing";
import { attachingGap, defaultThinkingStats, thinkingStats } from "../constants";
import { CowMooOptions } from "cowsayjs";
import { getRegularBunny } from "../assets/regularBunny";
import Component from "./Component";

function clearScreen() {
    console.clear();
    console.log(colors.bold(banner));
}

async function showStartScreen() {
    clearScreen();
    const message = colors.blue("Press enter to start the game");
    await inputCalling.waitForEnter(centerText(message));
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
    console.log(attach(attachingGap,
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
    console.log(attach(attachingGap,
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
    console.log(attach(attachingGap,
        Component.roundScreen(game),
        Component.say(speech, options)
    ));
}

async function showRoundScreenAndThink(
    game: Game,
    stats: Partial<thinkingStats> = {},
) {
    const cow = getRegularBunny(game.currentPlayer.color.bold);

    const fullStats: thinkingStats = {
        ...defaultThinkingStats,
        ...stats,
    };

    for (let i = 0; i <= fullStats.barLength; i++) {
        await new Promise(resolve => {
            showRoundScreenAndSay(
                game,
                "Thinking" + fullStats.symbol.repeat(i),
                {
                    action: "think",
                    cow,
                },
            );
            setTimeout(resolve, fullStats.time / (fullStats.barLength + 1));
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
