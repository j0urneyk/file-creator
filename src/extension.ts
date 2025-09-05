import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const command = 'file-creator.createFile';

    const commandHandler = async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('파일을 생성하기 위해선 먼저 작업 폴더를 열어주세요.');
            return;
        }
        const workspaceRoot = workspaceFolders[0].uri.fsPath;

        let basePath = workspaceRoot;
        const activeEditor = vscode.window.activeTextEditor;

        if (activeEditor) {
            const activeFilePath = activeEditor.document.uri.fsPath;
            if (!activeFilePath.startsWith(workspaceRoot)) {
                vscode.window.showWarningMessage('현재 열려있는 파일이 작업 공간(workspace)에 속해있지 않습니다.');
                return;
            }
            basePath = path.dirname(activeFilePath);
        }

        const relativePath = await vscode.window.showInputBox({
            prompt: '생성할 파일의 경로를 입력하세요.',
            value: basePath.replace(workspaceRoot, '') + path.sep,
            valueSelection: [basePath.length - workspaceRoot.length + 1, -1],
            placeHolder: '예: components/Button.tsx',
            validateInput: text => {
                if (!text || text.trim().length === 0) {
                    return '파일 경로를 입력해야 합니다.';
                }
                const invalidCharsRegex = /[<>:"\\|?*]/;
                const pathSegments = text.split(path.sep);

                for (const segment of pathSegments) {
                    if (invalidCharsRegex.test(segment)) {
                        return `경로명 "${segment}"에 유효하지 않은 문자가 포함되어 있습니다.`;
                    }
                }

                if (text.endsWith(path.sep) || text.endsWith('/')) {
                    return '경로가 디렉터리 구분자로 끝날 수 없습니다.';
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
                placeHolder: `파일이 이미 존재합니다: ${relativePath}. 덮어쓰시겠습니까?`
            });

            if (answer !== 'Yes') {
                vscode.window.showInformationMessage('파일 생성이 취소되었습니다.');
                return;
            }
        } catch (error) {
            // File does not exist, which is what we want.
            // We can proceed.
        }

        try {
            const dir = path.dirname(absolutePath);
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(dir));

            await vscode.workspace.fs.writeFile(fileUri, new Uint8Array());

            const document = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage(`파일이 성공적으로 생성되었습니다: ${relativePath}`);

        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'NoPermissions') {
                vscode.window.showErrorMessage('파일을 생성할 권한이 없습니다. 폴더 권한을 확인해주세요.');
            } else if (error instanceof Error) {
                vscode.window.showErrorMessage(`파일 생성 중 오류가 발생했습니다: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`파일 생성 중 알 수 없는 오류가 발생했습니다.`);
            }
        }
    };

    context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
}

export function deactivate() {}
