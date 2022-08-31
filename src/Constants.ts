export enum CARD_SYMBOLS { SPADES, HEARTS, CLUBS, DIAMONDS }

export const BORDERS = {
    ROUND: {
        top: "─",
        left: "│",
        bottom: "─",
        right: "│",
        topLeft: "╭",
        topRight: "╮",
        bottomRight: "╯",
        bottomLeft: "╰"
    },
    SHARP: {
        top: "─",
        left: "│",
        bottom: "─",
        right: "│",
        topLeft: "┌",
        topRight: "┐",
        bottomRight: "┘",
        bottomLeft: "└"
    }
};

export const CARD_SYMBOLS_ARRAY = [
    CARD_SYMBOLS.SPADES,
    CARD_SYMBOLS.HEARTS,
    CARD_SYMBOLS.CLUBS,
    CARD_SYMBOLS.DIAMONDS
];

export enum CHOICES { FIRST, LAST }