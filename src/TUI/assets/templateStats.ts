import colors from "colors";

interface cowTemplateStats {
    name: string;
    skinColor: colors.Color;

    action: {
        symbol: string;
        rows: number[];
        color: colors.Color;
    };

    eye: {
        symbol: string;
        row: number;
        color: colors.Color;
    };

    tongue: {
        symbol: string;
        row: number;
        color: colors.Color;
    };

    coloredLines: number[];
}

export { cowTemplateStats };
