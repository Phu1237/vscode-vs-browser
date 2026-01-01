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

/**
 * Extract URLs from text
 * @param text Text to extract URLs from
 * @returns Array of URLs
 */
export function extractURLs(text: string): RegExpExecArray[] {
  return [...text.matchAll(/https?:\/\/[^\s]*[-a-zA-Z0-9+&@#\/%=~_|]/g)];
}

export function isOpenLinkEnabled(): boolean {
  const configs = vscode.workspace.getConfiguration("vs-browser.link");
  return configs.get<boolean>("enabled") || false;
}
