import GameRunner from "./GameRunner";

async function main() {
    const runner = new GameRunner();
    await runner.setup();
    await runner.runGame();
}

main();