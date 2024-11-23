import * as vscode from "vscode";

export const startStatusBarItem: vscode.StatusBarItem =
  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

export function createStartStatusBarItem(context: vscode.ExtensionContext) {
  // create a new status bar item that we can now manage
  const configs = vscode.workspace.getConfiguration("vs-browser");
  let showStatusBarItem = configs.get<boolean>("showStatusBarItem") || false;
  startStatusBarItem.command = "vs-browser.start";
  startStatusBarItem.text = "$(globe) VS Browser";
  startStatusBarItem.tooltip = "Start VS Browser";
  context.subscriptions.push(startStatusBarItem);
  if (showStatusBarItem) {
    startStatusBarItem.show();
  }
  // show/hide status bar item when config changed
  vscode.workspace.onDidChangeConfiguration(() => {
    const configs = vscode.workspace.getConfiguration("vs-browser");
    showStatusBarItem = configs.get<boolean>("showStatusBarItem") || false;
    if (!showStatusBarItem) {
      startStatusBarItem.hide();
    } else {
      startStatusBarItem.show();
    }
  });
}
