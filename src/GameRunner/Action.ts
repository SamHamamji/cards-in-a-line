enum ActionType {
    AddBot = "AddBot",
    AddHuman = "AddHuman",
    AskPlayAgain = "AskPlayAgain",
    DeletePlayer = "DeletePlayer",
    EditCardNumber = "EditCardNumber",
    EditColor = "EditColor",
    EditName = "EditName",
    EditPlayer = "EditPlayer",
    EditStrategy = "EditStrategy",
    EndScreen = "EndScreen",
    Exit = "Exit",
    EditSettings = "EditSettings",
    Home = "Home",
    RunGame = "RunGame",
    SetupSettings = "SetupSettings",
    StartGame = "StartGame",
    StartScreen = "StartScreen",
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

export { Action, ActionType };