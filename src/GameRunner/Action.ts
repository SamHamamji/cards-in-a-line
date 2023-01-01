enum ActionType {
    AddBot = "AddBot",
    AddHuman = "AddHuman",
    EditPlayer = "EditPlayer",
    EditColor = "EditColor",
    EditName = "EditName",
    EditStrategy = "EditStrategy",
    DeletePlayer = "DeletePlayer",
    EditCardNumber = "EditCardNumber",
    // GiveCustomCards = "GiveCustomCards",
    GoHome = "GoHome",
    Start = "Start"
}

type ActionNeedingPlayer = ActionType.EditPlayer | ActionType.EditName |
    ActionType.EditStrategy | ActionType.EditColor;

type Action = {
    type: Exclude<ActionType, ActionNeedingPlayer>;
    playerIndex?: number;
} | {
    type: ActionNeedingPlayer;
    playerIndex: number;
};

export { Action, ActionType, ActionNeedingPlayer };