import { readFileSync } from "fs";
import { Cow } from "cowsayjs/cows";
import { cowTemplateStats } from "./templateStats";
import { Color } from "colors/index";

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
    stats: cowTemplateStats,
    skinColor: Color,
) {
    if (!stats.coloredLines.includes(y))
        return line;

    line = skinColor(line);
    if (stats.action.rows.includes(y))
        line = colorizeIndexInLine(
            line,
            findAction(line, stats),
            stats.action.color,
            skinColor,
        );

    if (stats.tongue.row === y)
        line = colorizeIndexInLine(
            line,
            findTongueInLine(line, stats),
            stats.tongue.color,
            skinColor,
        );

    if (stats.eye.row === y) {
        line = colorizeIndexInLine(
            line,
            findLeftEyeInLine(line, stats),
            stats.eye.color,
            skinColor,
        );
        line = colorizeIndexInLine(
            line,
            findRightEyeInLine(line, stats),
            stats.eye.color,
            skinColor,
        );
    }

    return line;
}

function colorizeIndexInLine(
    line: string,
    index: number,
    color: Color,
    defaultColor: Color,
) {
    return line.slice(0, index) +
        color(line[index]) +
        defaultColor(line.slice(index + 1));
}

function colorizeBunnyTemplate(
    rawTemplate: string[],
    stats: cowTemplateStats,
): Cow {
    const coloredTemplate = rawTemplate.map((line, y) =>
        colorizeLine(line, y, stats, stats.skinColor)
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

export {
    colorizeBunnyTemplate
};