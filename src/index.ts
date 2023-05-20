#! /usr/bin/env node

import GameRunner from "./GameRunner";

async function main() {
    const runner = new GameRunner();
    await runner.run();
}

main();