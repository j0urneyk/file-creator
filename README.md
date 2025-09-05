# File Creator VSCode 확장 프로그램

이 확장 프로그램은 VSCode에서 `Cmd+Option+P` (macOS) 또는 `Ctrl+Alt+P` (Windows/Linux) 단축키를 사용하여 현재 작업 공간(workspace) 내에 상대 경로로 파일을 빠르게 생성하는 기능을 제공합니다.

## 로컬 개발 및 테스트 환경 설정

이 확장 프로그램을 로컬 환경에서 테스트하고 개발하기 위한 안내입니다.

### 사전 준비 사항

*   [Visual Studio Code](https://code.visualstudio.com/) 최신 버전 설치
*   [Node.js](https://nodejs.org/) (LTS 버전 권장) 및 `npm` 설치

### 테스트를 위한 설치 방법

1.  이 프로젝트를 로컬 컴퓨터에 클론(clone)하거나 다운로드합니다.
2.  터미널(Terminal) 또는 명령 프롬프트(Command Prompt)를 열고 프로젝트의 루트 디렉터리로 이동합니다.
3.  다음 명령어를 실행하여 필요한 의존성 패키지를 설치합니다.

    ```bash
    npm install
    ```

### 확장 프로그램 실행 및 테스트 (개발 모드)

VSCode는 확장 프로그램 개발을 위한 강력한 디버깅 환경을 제공합니다.

1.  VSCode에서 이 프로젝트 폴더를 엽니다.
2.  **F5** 키를 누릅니다. (또는 `실행 > 디버깅 시작` 메뉴 선택)
3.  이 명령을 실행하면, **확장 개발 호스트(Extension Development Host)** 라는 새로운 VSCode 창이 열립니다. 이 창은 여러분이 개발 중인 확장 프로그램이 임시로 설치된 특별한 VSCode 인스턴스입니다.
4.  새로운 VSCode 창에서 테스트할 프로젝트 폴더를 엽니다. (예: `File > Open Folder...`)
5.  이제 확장 프로그램의 모든 기능을 테스트할 수 있습니다.
    *   단축키 `Cmd+Option+P` (macOS) 또는 `Ctrl+Alt+P` (Windows/Linux)를 누릅니다.
    *   상단에 나타나는 입력창에 생성하고 싶은 파일의 상대 경로를 입력합니다. (예: `src/components/Test.js`)
    *   파일이 정상적으로 생성되고, 필요한 중간 폴더가 만들어졌는지 파일 탐색기에서 확인합니다.
    *   파일이 이미 존재할 경우 덮어쓰기 확인 메시지가 나타나는지 테스트합니다.
    *   유효하지 않은 경로(예: `src/my<invalid>file.txt`)를 입력했을 때 오류 메시지가 제대로 표시되는지 확인합니다.

### 디버깅 방법

*   원래의 VSCode 창(개발 호스트 창이 아닌)으로 돌아옵니다.
*   `src/extension.ts` 파일의 코드 라인 번호 왼쪽에 마우스를 클릭하여 중단점(breakpoint)을 설정할 수 있습니다.
*   확장 개발 호스트 창에서 다시 기능을 실행하면, 코드가 중단점에서 멈추고 변수 값을 확인하거나 코드를 한 줄씩 실행하는 등 디버깅을 할 수 있습니다.

### 문제 해결 팁

*   **명령어가 없다고 나오는 경우 (`command not found`)**:
    *   `package.json` 파일의 `activationEvents`와 `contributes.commands` 설정이 올바른지 확인하세요.
    *   코드를 수정한 후, TypeScript가 JavaScript로 제대로 컴파일되었는지 확인하세요. 터미널에서 `npm run compile` 명령을 수동으로 실행해볼 수 있습니다.
*   **F5를 눌러도 창이 뜨지 않는 경우**:
    *   프로젝트 루트에 `.vscode/launch.json` 파일이 올바르게 설정되어 있는지 확인하세요. (보통 `yo code`로 프로젝트 생성 시 자동으로 만들어집니다. 만약 없다면, 디버그 뷰에서 'create a launch.json file'을 선택하여 Node.js 환경으로 생성할 수 있습니다.)
*   **코드 변경 사항이 적용되지 않는 경우**:
    *   `src/extension.ts` 파일을 수정한 후에는 확장 개발 호스트를 재시작해야 합니다. (개발 호스트 창을 닫고 다시 F5를 누르거나, 디버그 툴바의 재시작 버튼 클릭)
