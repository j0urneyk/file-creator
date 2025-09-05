import * as vscode from 'vscode';
import * as path from 'path';
import * as nls from 'vscode-nls';

const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export function activate(context: vscode.ExtensionContext) {
    const command = 'file-creator.createFile';

    const commandHandler = async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage(localize('error.noWorkspace', 'Please open a workspace folder first to create a file.'));
            return;
        }
        const workspaceRoot = workspaceFolders[0].uri.fsPath;

        let basePath = workspaceRoot;
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            const activeFilePath = activeEditor.document.uri.fsPath;
            if (!activeFilePath.startsWith(workspaceRoot)) {
                vscode.window.showWarningMessage(localize('warning.fileNotInWorkspace', 'The currently open file does not belong to the workspace.'));
                return;
            }
            basePath = path.dirname(activeFilePath);
        }

        const relativePath = await vscode.window.showInputBox({
            prompt: localize('prompt.enterFilePath', 'Enter the path for the file to be created.'),
            value: basePath.replace(workspaceRoot, '') + path.sep,
            valueSelection: [basePath.length - workspaceRoot.length + 1, -1],
            placeHolder: localize('prompt.placeholder', 'e.g., src/components/Button.tsx'),
            validateInput: text => {
                if (!text || text.trim().length === 0) {
                    return localize('validation.emptyPath', 'A file path must be entered.');
                }
                const invalidCharsRegex = /[<>:"\\|?*]/;
                const pathSegments = text.split(path.sep);

                for (const segment of pathSegments) {
                    if (invalidCharsRegex.test(segment)) {
                        return localize('validation.invalidSegment', 'The path segment "{0}" contains invalid characters.', segment);
                    }
                }

                if (text.endsWith(path.sep) || text.endsWith('/')) {
                    return localize('validation.endsWithSeparator', 'The path cannot end with a directory separator.');
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
                placeHolder: localize('prompt.fileExists', 'File already exists: {0}. Overwrite?', relativePath)
            });

            if (answer !== 'Yes') {
                vscode.window.showInformationMessage(localize('info.creationCancelled', 'File creation was cancelled.'));
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

            vscode.window.showInformationMessage(localize('info.creationSuccess', 'File successfully created: {0}', relativePath));

        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'NoPermissions') {
                vscode.window.showErrorMessage(localize('error.noPermissions', 'Permission denied. Please check folder permissions to create the file.'));
            } else if (error instanceof Error) {
                vscode.window.showErrorMessage(localize('error.creationError', 'Error creating file: {0}', error.message));
            } else {
                vscode.window.showErrorMessage(localize('error.unknownCreationError', 'An unknown error occurred while creating the file.'));
            }
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}

export function deactivate() {}
