# Action graph
 - This is a file to be used with [GraphvizOnline](https://dreampuf.github.io/GraphvizOnline) to visualize the graph of actions in the GameRunner

## To see the graph
 1. Open [GraphvizOnline](https://dreampuf.github.io/GraphvizOnline)
 2. Copy and paste the graph data in the text box
 3. It may take a few seconds for the graph image to update

## Graph data
``` t
digraph G {
    StartScreen -> Home;

    Home -> SetupSettings;

    SetupSettings -> EditSettings;
    SetupSettings -> StartGame;

    EditSettings -> EditPlayer;
    EditSettings -> AddHuman;
    EditSettings -> AddBot;
    EditSettings -> EditCardNumber;
    EditSettings -> StartGame;

    AddHuman -> EditSettings;
    AddBot -> EditSettings;
    EditCardNumber -> EditSettings;

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
    EditSettings -> EditPlayer;

    // StartGame
    StartGame -> RunGame;
    StartGame -> Home;

    RunGame -> EndScreen;

    EndScreen -> AskPlayAgain;

    AskPlayAgain -> RunGame;
    AskPlayAgain -> Home;
    AskPlayAgain -> Exit;

    Exit -> AskPlayAgain;
    Exit -> Stop;

    StartScreen[shape = Msquare];
    Stop[shape = Msquare];
}
```
