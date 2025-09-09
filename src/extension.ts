import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const command = 'file-creator.createFile';

    const commandHandler = async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Please open a workspace folder first to create a file.');
            return;
        }
        const workspaceRoot = workspaceFolders[0].uri.fsPath;

        let basePath = workspaceRoot;
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            const activeFilePath = activeEditor.document.uri.fsPath;
            if (!activeFilePath.startsWith(workspaceRoot)) {
                vscode.window.showWarningMessage('The currently open file does not belong to the workspace.');
                return;
            }
            basePath = path.dirname(activeFilePath);
        }

        const relativePath = await vscode.window.showInputBox({
            prompt: 'Enter the path for the file to be created.',
            value: basePath.replace(workspaceRoot, '') + path.sep,
            valueSelection: [basePath.length - workspaceRoot.length + 1, -1],
            placeHolder: 'e.g., src/components/Button.tsx',
            validateInput: text => {
                if (!text || text.trim().length === 0) {
                    return 'A file path must be entered.';
                }
                const invalidCharsRegex = /[<>:"\\|?*]/;
                const pathSegments = text.split(path.sep);

                for (const segment of pathSegments) {
                    if (invalidCharsRegex.test(segment)) {
                        return `The path segment "${segment}" contains invalid characters.`;
                    }
                }

                if (text.endsWith(path.sep) || text.endsWith('/')) {
                    return 'The path cannot end with a directory separator.';
                }

                return null;
            }
        });

        if (!relativePath) {
            return; // User cancelled
        }

        const absolutePath = path.join(workspaceRoot, relativePath);
        const fileUri = vscode.Uri.file(absolutePath);

        try {
            await vscode.workspace.fs.stat(fileUri);
            const answer = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: `File already exists: ${relativePath}. Overwrite?`
            });

            if (answer !== 'Yes') {
                vscode.window.showInformationMessage('File creation was cancelled.');
                return;
            }
        } catch (error) {
            // File does not exist, which is what we want.
        }

        try {
            const dir = path.dirname(absolutePath);
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(dir));

            await vscode.workspace.fs.writeFile(fileUri, new Uint8Array());

            const document = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage(`File successfully created: ${relativePath}`);

        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'NoPermissions') {
                vscode.window.showErrorMessage('Permission denied. Please check folder permissions to create the file.');
            } else if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error creating file: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred while creating the file.');
            }
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}

export function deactivate() {}
