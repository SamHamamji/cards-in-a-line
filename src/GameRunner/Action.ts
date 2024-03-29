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
    EditTimeDelay = "EditTimeDelay",
    EndScreen = "EndScreen",
    Exit = "Exit",
    EditSettings = "EditSettings",
    Home = "Home",
    RunGame = "RunGame",
    SetupCustom = "SetupCustom",
    SetupMultiPlayer = "SetupMultiPlayer",
    SetupSinglePlayer = "SetupSinglePlayer",
    StartGame = "StartGame",
    StartScreen = "StartScreen",
    Tutorial = "Tutorial",
}

type ActionNeedingPlayer = ActionType.EditPlayer |
    ActionType.EditName |
    ActionType.EditStrategy |
    ActionType.EditColor;

type Action = {
    type: Exclude<ActionType, ActionNeedingPlayer>;
    playerIndex?: number;
} | {
    type: ActionNeedingPlayer;
    playerIndex: number;
};

export {
    Action,
    ActionType,
};