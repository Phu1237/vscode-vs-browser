import * as vscode from "vscode";
// types
import Data from "../types/data";
// helpers
import { showMessage } from ".";
import * as statusBarItem from "./statusBarItem";
import * as server from "./server";
import CONST_WEBVIEW from "../constants/webview";
import path = require("path");

/**
 * Inject event and context to panel
 * @param context Extension context
 * @param data Data to inject
 * @returns
 */
export function createWebviewPanel(
  template: Function,
  context: vscode.ExtensionContext,
  data: Data,
  webviewPanel?: vscode.WebviewPanel
) {
  // Start proxy server
  let configs = vscode.workspace.getConfiguration("vs-browser");
  let proxyMode =
    data["proxyMode"] !== undefined
      ? data["proxyMode"]
      : configs.get<boolean>("proxyMode") || false;
  let localProxyServerEnabled =
    data["localProxyServerEnabled"] !== undefined
      ? data["localProxyServerEnabled"]
      : configs.get<boolean>("localProxyServer.enabled") || false;
  if (proxyMode && localProxyServerEnabled) {
    server.start(function () {
      const configs = vscode.workspace.getConfiguration("vs-browser");
      const port = configs.get<number>("localProxyServer.port") || 9999;
      statusBarItem.startStatusBarItem.text = "$(cloud) VS Browser: " + port;
    });
  }

  let panel = webviewPanel;
  if (!panel) {
    // Create new column
    const column =
      data["columnToShowIn"] !== undefined
        ? data["columnToShowIn"]
        : configs.get<string>("columnToShowIn") || "Two";
    let columnToShowIn = vscode.ViewColumn.Two;
    switch (column) {
      case "One":
        columnToShowIn = vscode.ViewColumn.One;
        break;
      case "Two":
        columnToShowIn = vscode.ViewColumn.Two;
        break;
      case "Three":
        columnToShowIn = vscode.ViewColumn.Three;
        break;
      case "Active":
        columnToShowIn = vscode.ViewColumn.Active;
        break;
      case "Beside":
        columnToShowIn = vscode.ViewColumn.Beside;
        break;
      default:
    }
    panel = vscode.window.createWebviewPanel(
      "vs-browser." + data["viewType"], // Identifies the type of the webview. Used internally
      data["title"], // Title of the panel displayed to the user
      columnToShowIn, // Editor column to show the new webview panel in.
      {
        enableScripts: true,
        // freeze when panel not focused
        retainContextWhenHidden: true,
        // enable find widget
        enableFindWidget: true,
      }
    );
  }

  panel = bindWebviewEvents(panel, template, context, data);

  return panel;
}

/**
 * Get webview context
 * @param webview
 * @param extensionUri
 * @param data
 * @returns
 */
export function getWebViewContent(
  template: Function,
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  extensionPath: string,
  data: Data
) {
  // Create uri for webview
  const webviewUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "/")
  ) as unknown as string;

  return template(
    {
      webviewUri: webviewUri,
      extensionPath: extensionPath + "/",
    } as WebviewContext,
    data
  );
}

function bindWebviewEvents(
  panel: any,
  template: Function,
  context: vscode.ExtensionContext,
  data: Data
): vscode.WebviewPanel {
  let configs = vscode.workspace.getConfiguration("vs-browser");
  panel.webview.html = getWebViewContent(
    template,
    panel.webview,
    context.extensionUri,
    context.extensionPath,
    data
  );
  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    (message: any) => {
      console.log("Received message:", message);
      switch (message.command) {
        case "open-inspector":
          console.log("Click on Open Inspector button");
          vscode.commands.executeCommand(
            "workbench.action.webview.openDeveloperTools"
          );
          return;
        case "go-to-settings":
          console.log("Click on Go to Settings button");
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "vs-browser"
          );
          return;
        case "show-message-box":
          let type = message.type;
          let text = message.text;
          let detail = message.detail;
          console.log(message.detail);
          showMessage(type, text, {
            detail: detail,
          });
          return;
      }
    },
    undefined,
    context.subscriptions
  );
  // Handle panel state change event
  panel.onDidChangeViewState(
    (e: any) => {
      let panel = e.webviewPanel;

      switch (panel.viewColumn) {
        case vscode.ViewColumn.One:
          console.log("ViewColumn.One");
          return;

        case vscode.ViewColumn.Two:
          console.log("ViewColumn.Two");
          return;

        case vscode.ViewColumn.Three:
          console.log("ViewColumn.Three");
          return;
      }
    },
    null,
    context.subscriptions
  );
  // Handle when panel is closed
  panel.onDidDispose(
    () => {
      // When the panel is closed, cancel any future updates to the webview content
      const configs = vscode.workspace.getConfiguration("vs-browser");
      let localProxyServerEnabled = configs.get<boolean>(
        "localProxyServer.enabled"
      );
      if (localProxyServerEnabled) {
        server.stop(function () {
          statusBarItem.startStatusBarItem.text = "$(globe) VS Browser";
        });
      }
    },
    null,
    context.subscriptions
  );

  // Handle when save file
  let reloadOnSave =
    data["reloadOnSave"] !== undefined
      ? data["reloadOnSave"]
      : configs.get<boolean>("reload.onSave") || false;
  if (reloadOnSave) {
    vscode.workspace.onDidSaveTextDocument(() => {
      panel.webview.postMessage({
        command: CONST_WEBVIEW.POST_MESSAGE.COMMAND.RELOAD,
      });
    });
  }

  return panel;
}
