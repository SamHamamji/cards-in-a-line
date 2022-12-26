enum ActionType {
    AddBot = "AddBot",
    AddHuman = "AddHuman",
    EditName = "EditName",
    EditStrategy = "EditStrategy",
    EditColor = "EditColor",
    DeletePlayer = "DeletePlayer",
    EditPlayer = "EditPlayer",
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