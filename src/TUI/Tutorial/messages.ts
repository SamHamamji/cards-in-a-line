import colors from "colors/safe";

const messages = {
    wait: colors.blue("  Press enter to continue"),
    intro: (botName: string) =>
        `Hi, I'm ${botName}, I'll show you the rules of my game.`,
    greetUser: (userName: string) =>
        `Alright ${userName}, so this is how we play...`,
    askForUserName: {
        speech: "First of all, what's your name?",
        prompt: "Enter a username",
    },
    startPlaying: [
        "Enough talking, let's start playing!",
        "The card you have picked is now colored. Your score has also increased by the card's value",
        "It's my turn now",
    ],
    rules: [
        "The game board starts as cards randomly arranged in a line",
        "The goal of the game is to have the greatest sum of card values at the end of the game",
        "The players will take turns picking either one of the cards at the ends of the line",
        "The game ends when there are no cards remaining",
    ],
    yourTurn: "It's your turn now",
    endScreen: {
        userWins: "Good job!",
        botWins: "Don't worry, you can still train as much as you want",
        tie: "Oof, that was an intense game!"
    },
    outro: [
        "The game can also be played with any number of bots or users",
        "You can also select bot strategies from a list or even code your own strategies",
        "Have fun!",
    ],
} as const;

export default messages;