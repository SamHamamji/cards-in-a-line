import inputCalling from "../inputCalling";
import screenManaging from "../screenManaging";
import Game from "../../Game";
import Player from "../../Game/Player";
import Strategies from "../../Strategies";
import messages from "./messages";
import settings from "./settings";
import CardGenerator from "../../GameRunner/CardGenerator";

async function showTutorial() {
    await showTutorialIntro();
    const userName = await askForUserName();
    await greetUser(userName);

    const game = setupTutorialGame(userName);
    await explainGameRules(game);
    await playGame(game);

    await showTutorialOutro();
}

async function showTutorialIntro() {
    await screenManaging.showSpeechAndWait(
        messages.intro(settings.botStats.name),
        messages.wait,
    );
}

async function askForUserName() {
    screenManaging.showSpeech(messages.askForUserName.speech);
    return await inputCalling.promptForString(
        messages.askForUserName.prompt,
        settings.maxNameLength,
    );
}

async function greetUser(userName: string) {
    await screenManaging.showSpeechAndWait(
        messages.greetUser(userName),
        messages.wait,
    );
}

function setupTutorialGame(userName: string) {
    const players = [
        new Player(
            userName,
            new Strategies.UserInput(),
            settings.userColor,
        ),
        new Player(
            settings.botStats.name,
            new Strategies[settings.botStats.botStrategy](),
            settings.botStats.color,
        ),
    ];
    const board = CardGenerator.generateCards(settings.cardNumber);
    return new Game(players, board);
}

async function explainGameRules(game: Game) {
    for (let i = 0; i < messages.rules.length; i++) {
        await screenManaging.showRoundScreenSayAndWait(
            game,
            messages.rules[i],
            messages.wait,
        );
    }
}

async function playGame(game: Game) {
    await startPlayingGame(game);

    while (!game.isOver()) {
        if (game.currentPlayer.isUser())
            screenManaging.showRoundScreenAndSay(game, messages.yourTurn);
        else
            await screenManaging.showRoundScreenAndThink(game);

        await game.playOneRound();
    }

    await showEndScreen(game);
}

async function startPlayingGame(game: Game) {
    screenManaging.showRoundScreenAndSay(game, messages.startPlaying[0]);
    await game.playOneRound();

    await screenManaging.showRoundScreenSayAndWait(
        game,
        messages.startPlaying[1],
        messages.wait,
    );
    await screenManaging.showRoundScreenSayAndWait(
        game,
        messages.startPlaying[2],
        messages.wait,
    );
    await screenManaging.showRoundScreenAndThink(game);
    await game.playOneRound();
}

async function showEndScreen(game: Game) {
    const ranking = game.ranking();
    const speech = (ranking[0].length === 2)
        ? messages.endScreen.tie
        : (ranking[0][0].player.isUser())
            ? messages.endScreen.userWins
            : messages.endScreen.botWins;

    await screenManaging.showEndScreenSayAndWait(
        game,
        speech,
        messages.wait,
    );
}

async function showTutorialOutro() {
    for (const message of messages.outro)
        await screenManaging.showSpeechAndWait(message, messages.wait);
}

export default { showTutorial };
