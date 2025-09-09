# File Creator VSCode Extension

This extension provides a command to quickly create files in VSCode using a keyboard shortcut.

## Features

*   **Quick File Creation**: Use the `Cmd+1` (macOS) or `Ctrl+1` (Windows/Linux) shortcut to initiate file creation.
*   **Intelligent Path Suggestion**:
    *   If a file is currently open in the editor, its directory is used as the default base path for the new file.
    *   If no file is open, the workspace root is used as the base path.
    *   The command is disabled if the currently open file is outside the workspace to prevent errors.
*   **Automatic Folder Creation**: Automatically creates any necessary intermediate directories for your new file.
*   **Overwrite Protection**: Prompts for confirmation if a file with the same name already exists.
*   **i18n Ready**: Supports multiple languages based on your VSCode locale.

## Supported Languages

*   English (en) - Default
*   Korean (ko)

## Local Development and Testing

Instructions for setting up and testing this extension in a local development environment.

### Prerequisites

*   Latest version of [Visual Studio Code](https://code.visualstudio.com/)
*   [Node.js](https://nodejs.org/) (LTS version recommended) and `npm`

### Installation for Testing

1.  Clone or download this project to your local machine.
2.  Open a terminal or command prompt and navigate to the project's root directory.
3.  Run the following command to install the necessary dependencies:
    ```bash
    npm install
    ```

### Running and Testing the Extension (Development Mode)

1.  Open this project folder in VSCode.
2.  Press **F5** to start a debugging session (or select `Run > Start Debugging` from the menu).
3.  When you press F5, the code will be automatically compiled before the extension is launched.
4.  Once compilation is complete, a new **Extension Development Host** window will open. This is a special VSCode instance with your extension temporarily installed.
5.  In the new host window, open any project folder to test the extension (e.g., `File > Open Folder...`).
6.  You can now test all the features of the extension.

### How to Debug

*   Return to your original VSCode window (the one where this project's code is open).
*   You can set breakpoints by clicking in the gutter to the left of the line numbers in the `src/extension.ts` file.
*   When you trigger the functionality in the Extension Development Host window, the code will pause at your breakpoints, allowing you to inspect variables and step through the code.
