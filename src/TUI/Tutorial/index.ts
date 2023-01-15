import { moo, CowMooOptions } from "cowsayjs";
import inputCalling from "../inputCalling";
import screenManaging from "../screenManaging";
import regularBunny from "./assets/regularBunny";
import Game from "../../Game";
import Player from "../../Game/Player";
import Strategies from "../../Strategies";
import textProcessing from "../textProcessing";
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
    screenManaging.clearScreen();
    console.log(say(messages.intro(settings.botStats.name)));
    await inputCalling.waitForEnter(messages.wait);
}

async function askForUserName() {
    screenManaging.clearScreen();
    console.log(say(messages.askForUserName.speech));
    return await inputCalling.promptForString(
        messages.askForUserName.prompt,
        settings.maxNameLength,
    );
}

async function greetUser(userName: string) {
    screenManaging.clearScreen();
    console.log(say(messages.greetUser(userName)));
    await inputCalling.waitForEnter(messages.wait);
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
        await showRoundSayAndWait(game, messages.rules[i]);
    }
}

async function playGame(game: Game) {
    await startPlayingGame(game);

    while (!game.isOver()) {
        if (game.currentPlayer.isUser())
            showRoundAndSay(game, messages.yourTurn);
        else
            await showRoundAndThink(game);

        await game.playOneRound();
    }

    await showEndScreen(game);
}

async function startPlayingGame(game: Game) {
    showRoundAndSay(game, messages.startPlaying[0]);
    await game.playOneRound();

    await showRoundSayAndWait(game, messages.startPlaying[1]);
    await showRoundSayAndWait(game, messages.startPlaying[2]);
    await showRoundAndThink(game);
    await game.playOneRound();
}

async function showEndScreen(game: Game) {
    const ranking = game.ranking();
    const speech = (ranking[0].length === 2) ? messages.endScreen.tie :
        (ranking[0][0].player.isUser()) ? messages.endScreen.userWins :
            messages.endScreen.botWins;

    screenManaging.clearScreen();
    console.log(
        textProcessing.attach(settings.attachingGap,
            screenManaging.getEndScreen(game),
            say(speech),
        )
    );

    await inputCalling.waitForEnter(messages.wait);
}

async function showTutorialOutro() {
    for (const message of messages.outro) {
        screenManaging.clearScreen();
        console.log(say(message));
        await inputCalling.waitForEnter(messages.wait);
    }
}

async function showRoundSayAndWait(
    game: Game,
    speech: string,
    prompt = messages.wait
) {
    screenManaging.clearScreen();
    console.log(textProcessing.attach(settings.attachingGap,
        screenManaging.getRoundScreen(game),
        [say(speech), prompt].join("\n"),
    ));
    await inputCalling.waitForEnter();
}

function showRoundAndSay(game: Game, speech: string) {
    screenManaging.clearScreen();
    console.log(textProcessing.attach(settings.attachingGap,
        screenManaging.getRoundScreen(game),
        say(speech)
    ));
}

async function showRoundAndThink(game: Game) {
    const roundScreen = screenManaging.getRoundScreen(game);

    for (let i = 0; i <= settings.thinkingStats.barLength; i++) {
        screenManaging.clearScreen();
        await new Promise(resolve => {
            console.log(textProcessing.attach(
                settings.attachingGap,
                roundScreen,
                say(
                    "Thinking" + settings.thinkingStats.symbol.repeat(i),
                    { action: "think" }
                )
            ));
            setTimeout(resolve, settings.thinkingStats.time / settings.thinkingStats.barLength);
        });
    }
}

function say(
    speech: string,
    {
        action = "say",
        cow = regularBunny,
        eyes = regularBunny.defEyes,
        tongue = regularBunny.defTongue,
        wrap = settings.speechWrap,
    }: CowMooOptions = {},
) {
    return moo(speech, {
        cow,
        action,
        eyes,
        tongue,
        wrap,
    });
}

export default { showTutorial };
