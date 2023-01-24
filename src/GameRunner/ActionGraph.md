# Action graph
 - This is a file to be used with [GraphvizOnline](https://dreampuf.github.io/GraphvizOnline) to visualize the graph of actions in the GameRunner

## To see the graph
 1. Open [GraphvizOnline](https://dreampuf.github.io/GraphvizOnline)
 2. Copy and paste the graph data in the text box
 3. It may take a few seconds for the graph image to update

## Graph data
``` ts
digraph G {
    StartScreen -> Home;

    Home -> SetupCustom;
    Home -> SetupMultiPlayer;
    Home -> SetupSinglePlayer;
    Home -> Tutorial -> Home;

    SetupCustom -> EditSettings;
    SetupMultiPlayer -> StartGame;
    SetupSinglePlayer -> StartGame;

    EditSettings -> Home;
    EditSettings -> StartGame;

    // EditSettings
    EditSettings -> AddHuman;
    EditSettings -> AddBot;
    EditSettings -> EditCardNumber;
    EditSettings -> EditTimeDelay;
    EditSettings -> EditPlayer;

    AddHuman -> EditSettings;
    AddBot -> EditSettings;
    EditCardNumber -> EditSettings;
    EditTimeDelay -> EditSettings;

    // EditPlayer
    EditPlayer -> EditName;
    EditPlayer -> EditColor;
    EditPlayer -> EditStrategy;
    EditPlayer -> DeletePlayer;
    EditPlayer -> EditSettings;

    EditName -> EditPlayer;
    EditColor -> EditPlayer;
    EditStrategy -> EditPlayer;
    DeletePlayer -> EditPlayer;

    // StartGame
    StartGame -> Home;
    StartGame -> RunGame -> EndScreen -> AskPlayAgain;

    AskPlayAgain -> RunGame;
    AskPlayAgain -> Home;
    AskPlayAgain -> Exit;

    Exit -> Home;
    Exit -> Stop;

    StartScreen[shape = Msquare];
    Stop[shape = Msquare];
}
```
