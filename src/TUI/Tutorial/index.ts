import inputCalling from "../inputCalling";
import screenManaging from "../screenManaging";
import Game from "../../Game";
import Player from "../../Game/Player";
import Strategies from "../../Strategies";
import messages from "./messages";
import settings from "./settings";
import CardGenerator from "../../GameRunner/CardGenerator";
import { getRegularBunny } from "../assets/regularBunny";
import { Cow } from "cowsayjs/cows/index";

async function showTutorial() {
    const bunny = getRegularBunny(settings.botStats.color);
    await showTutorialIntro(bunny);
    const userName = await askForUserName(bunny);
    await greetUser(userName, bunny);

    const game = setupTutorialGame(userName);
    await explainGameRules(game, bunny);
    await playGame(game, bunny);

    await showTutorialOutro(bunny);
}

async function showTutorialIntro(cow: Cow) {
    await screenManaging.showSpeechAndWait(
        messages.intro(settings.botStats.name),
        messages.wait,
        { cow },
    );
}

async function askForUserName(cow: Cow) {
    screenManaging.showSpeech(messages.askForUserName.speech, { cow });
    return await inputCalling.promptForString(
        messages.askForUserName.prompt,
        settings.maxNameLength,
    );
}

async function greetUser(userName: string, cow: Cow) {
    await screenManaging.showSpeechAndWait(
        messages.greetUser(userName),
        messages.wait,
        { cow },
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

async function explainGameRules(game: Game, cow: Cow) {
    for (let i = 0; i < messages.rules.length; i++) {
        await screenManaging.showRoundScreenSayAndWait(
            game,
            messages.rules[i],
            messages.wait,
            { cow },
        );
    }
}

async function playGame(game: Game, cow: Cow) {
    await startPlayingGame(game, cow);

    while (!game.isOver()) {
        if (game.currentPlayer.isUser())
            screenManaging.showRoundScreenAndSay(
                game,
                messages.yourTurn,
                { cow },
            );
        else
            await screenManaging.showRoundScreenAndThink(game, { cow });

        await game.playOneRound();
    }

    await showEndScreen(game, cow);
}

async function startPlayingGame(game: Game, cow: Cow) {
    screenManaging.showRoundScreenAndSay(
        game,
        messages.startPlaying[0],
        { cow },
    );
    await game.playOneRound();

    await screenManaging.showRoundScreenSayAndWait(
        game,
        messages.startPlaying[1],
        messages.wait,
        { cow },
    );
    await screenManaging.showRoundScreenSayAndWait(
        game,
        messages.startPlaying[2],
        messages.wait,
        { cow },
    );
    await screenManaging.showRoundScreenAndThink(game, { cow });
    await game.playOneRound();
}

async function showEndScreen(game: Game, cow: Cow) {
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
        { cow },
    );
}

async function showTutorialOutro(cow: Cow) {
    for (const message of messages.outro)
        await screenManaging.showSpeechAndWait(
            message,
            messages.wait,
            { cow }
        );
}

export default { showTutorial };
