import * as vscode from "vscode";

/**
 * Show message box
 * @param type Type of message
 * @param message Context of message
 * @param options https://code.visualstudio.com/api/references/vscode-api#MessageOptions
 */
export function showMessage(
  type: string,
  message: string,
  options: Object = {}
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");
  let showMessageDialog = configs.get<boolean>("showMessageDialog") || false;
  if (showMessageDialog) {
    switch (type) {
      case "error":
        vscode.window.showErrorMessage(message, options);
        break;
      case "warning":
        vscode.window.showWarningMessage(message, options);
        break;
      case "info":
        vscode.window.showInformationMessage(message, options);
    }
  }
}
