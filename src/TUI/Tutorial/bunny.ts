import { readFileSync } from "fs";
import path from "path";
import { Cow } from "cowsayjs/cows";
import { moo, CowMooOptions } from "cowsayjs";
import { BoxAction } from "cowsayjs/lib/box";

const bunnyFilePath = path.join(__dirname, "./bunny.txt");
const template = readFileSync(bunnyFilePath, "utf-8").split("\n");

const location = {
    action: {
        symbol: "!",
        rows: [0, 1, 2],
    },
    eye: {
        symbol: "•",
        row: 2,
    },
    tongue: {
        symbol: "ㅅ",
        row: 2,
    },
};

const bunny: Cow = {
    name: "bunny",
    template,
    defEyes: "••",
    defTongue: "ㅅ",
    actionPos: location.action.rows.map(y =>
        [y, template[y].indexOf(location.action.symbol)]
    ),
    eyesPos: [[
        location.eye.row,
        template[location.eye.row].indexOf(location.eye.symbol)
    ], [
        location.eye.row,
        template[location.eye.row].lastIndexOf(location.eye.symbol)
    ]],
    tonguePos: [[
        location.tongue.row,
        template[location.tongue.row].indexOf(location.tongue.symbol)
    ]]
};

const speechWrap = 28;

function say(speech: string, action: BoxAction = "say",
    eyes = bunny.defEyes, tongue = bunny.defTongue): string {
    const options: CowMooOptions = {
        cow: bunny,
        action,
        eyes,
        tongue,
        wrap: speechWrap,
    };
    return moo(speech, options);
}

export { bunny, say };
