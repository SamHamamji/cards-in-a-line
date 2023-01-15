import { readFileSync } from "fs";
import colors from "colors";
import { Cow } from "cowsayjs/cows";
import { cowTemplateStats } from "./templateStats";

function findAction(line: string, stats: cowTemplateStats): number {
    return line.indexOf(stats.action.symbol);
}

function findTongueInTemplate(template: string[], stats: cowTemplateStats) {
    return template[stats.tongue.row].indexOf(
        stats.tongue.symbol
    );
}

function findTongueInLine(line: string, stats: cowTemplateStats) {
    return line.indexOf(
        stats.tongue.symbol
    );
}

function findLeftEyeInTemplate(template: string[], stats: cowTemplateStats) {
    return template[stats.eye.row].indexOf(
        stats.eye.symbol
    );
}

function findRightEyeInTemplate(template: string[], stats: cowTemplateStats) {
    return template[stats.eye.row].lastIndexOf(
        stats.eye.symbol
    );
}

function findLeftEyeInLine(line: string, stats: cowTemplateStats) {
    return line.indexOf(
        stats.eye.symbol
    );
}

function findRightEyeInLine(line: string, stats: cowTemplateStats) {
    return line.lastIndexOf(
        stats.eye.symbol
    );
}

function colorizeLine(
    line: string,
    y: number,
    stats: cowTemplateStats
) {
    if (!stats.coloredLines.includes(y))
        return line;

    line = stats.skinColor(line);
    if (stats.action.rows.includes(y))
        line = colorizeIndexInLine(
            line,
            findAction(line, stats),
            stats.action.color,
            stats.skinColor,
        );

    if (stats.tongue.row === y)
        line = colorizeIndexInLine(
            line,
            findTongueInLine(line, stats),
            stats.tongue.color,
            stats.skinColor,
        );

    if (stats.eye.row === y) {
        line = colorizeIndexInLine(
            line,
            findLeftEyeInLine(line, stats),
            stats.eye.color,
            stats.skinColor,
        );
        line = colorizeIndexInLine(
            line,
            findRightEyeInLine(line, stats),
            stats.eye.color,
            stats.skinColor,
        );
    }

    return line;
}

function colorizeIndexInLine(
    line: string,
    index: number,
    color: colors.Color,
    defaultColor: colors.Color
) {
    return line.slice(0, index) +
        color(line[index]) +
        defaultColor(line.slice(index + 1));
}

function readBunnyTemplate(path: string, stats: cowTemplateStats): Cow {
    const rawTemplate = readFileSync(path, "utf-8").split("\n");

    const coloredTemplate = rawTemplate.map((line, y) =>
        colorizeLine(line, y, stats)
    );

    return {
        name: stats.name,
        template: coloredTemplate,
        defEyes: stats.eye.symbol.repeat(2),
        defTongue: stats.tongue.symbol,
        actionPos: stats.action.rows.map(y => [
            y,
            findAction(coloredTemplate[y], stats)
        ]),
        eyesPos: [[
            stats.eye.row,
            findLeftEyeInTemplate(coloredTemplate, stats)
        ], [
            stats.eye.row,
            findRightEyeInTemplate(coloredTemplate, stats)
        ]],
        tonguePos: [[
            stats.eye.row,
            findTongueInTemplate(coloredTemplate, stats)
        ]],
    };
}

export { readBunnyTemplate };