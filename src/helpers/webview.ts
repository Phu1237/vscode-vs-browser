import * as vscode from "vscode";
// types
import Data, { FavouriteData } from "../types/data";
// helpers
import { showMessage } from "./common";
import * as server from "./server";
import CONST_CONFIGS from "../constants/configs";
import CONST_WEBVIEW from "../constants/webview";
import { startStatusBarItem } from "../helpers/extension";

let activePanels: Array<vscode.WebviewPanel> = [];

/**
 * Inject event and context to panel
 *
 * @param template Template of the webview
 * @param context Extension context
 * @param data Data to inject
 * @param webviewPanel Panel to show (ex: From restored state)
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
      startStatusBarItem.text = "$(cloud) VS Browser: " + port;
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

  bindWebviewEvents(panel, template, context, data);

  activePanels.push(panel);
  return panel;
}

/**
 * Get webview context
 *
 * @param webview
 * @param extensionUri
 * @param extensionPath
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

export function sendMessageToActivePanels(message: WebviewMessage) {
  console.log("Sending message to active panels: ", activePanels, message);
  activePanels.forEach((activePanel) => {
    sendMessageToWebview(activePanel, message);
  });
}

export function sendMessageToWebview(
  panel: vscode.WebviewPanel,
  message: WebviewMessage
) {
  panel.webview.postMessage(message);
}

export function bindWebviewEvents(
  panel: any,
  template: Function,
  context: vscode.ExtensionContext,
  data: Data
): void {
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
    (message: WebviewMessage) => {
      switch (message.type) {
        case CONST_WEBVIEW.POST_MESSAGE.TYPE.FAVOURITE_ADD:
        case CONST_WEBVIEW.POST_MESSAGE.TYPE.FAVOURITE_REMOVE: {
          const configs = vscode.workspace.getConfiguration(
            "vs-browser.favourites"
          );
          const configsFavouritesSavingProfile =
            configs.get("savingProfile") ||
            CONST_CONFIGS.FAVOURITES_SAVING_PROFILE.DEFAULT;

          let favouritesSavingProfile;
          if (
            configsFavouritesSavingProfile ===
            CONST_CONFIGS.FAVOURITES_SAVING_PROFILE.NAME.GLOBAL
          ) {
            favouritesSavingProfile = vscode.ConfigurationTarget.Global;
          } else if (
            configsFavouritesSavingProfile ===
            CONST_CONFIGS.FAVOURITES_SAVING_PROFILE.NAME.WORKSPACE
          ) {
            favouritesSavingProfile = vscode.ConfigurationTarget.Workspace;
          }

          let favourites = configs.get<FavouriteData>("list") || {};
          favourites = {
            ...favourites,
          };
          if (message.type === CONST_WEBVIEW.POST_MESSAGE.TYPE.FAVOURITE_ADD) {
            console.log("Click on Add to Favourites button");
            favourites[message.value] = message.value;
          } else {
            console.log("Click on Remove from Favourites button");
            delete favourites[message.value];
          }
          configs.update("list", favourites, favouritesSavingProfile);
          console.log("Saved favorites: ", favourites);

          sendMessageToActivePanels({
            type: CONST_WEBVIEW.POST_MESSAGE.TYPE.REFRESH_FAVOURITES,
            value: favourites,
          });
          return;
        }
        case CONST_WEBVIEW.POST_MESSAGE.TYPE.OPEN_INSPECTOR:
          console.log("Click on Open Inspector button");
          vscode.commands.executeCommand(
            "workbench.action.webview.openDeveloperTools"
          );
          return;
        case CONST_WEBVIEW.POST_MESSAGE.TYPE.GO_TO_SETTINGS:
          vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "vs-browser"
          );
          return;
        case CONST_WEBVIEW.POST_MESSAGE.TYPE.SHOW_MESSAGE_BOX:
          let type = message.value.type;
          let text = message.value.text;
          let detail = message.value.detail;
          console.log(message.value.detail);
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
  // panel.onDidChangeViewState(
  //   (e: any) => {
  //     let panel = e.webviewPanel;

  //     switch (panel.viewColumn) {
  //       case vscode.ViewColumn.One:
  //         console.log("ViewColumn.One");
  //         return;

  //       case vscode.ViewColumn.Two:
  //         console.log("ViewColumn.Two");
  //         return;

  //       case vscode.ViewColumn.Three:
  //         console.log("ViewColumn.Three");
  //         return;
  //     }
  //   },
  //   null,
  //   context.subscriptions
  // );
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
          startStatusBarItem.text = "$(globe) VS Browser";
        });
      }
      activePanels = activePanels.filter((p) => p !== panel);
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
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.fileName.endsWith("settings.json")) {
        console.log(
          "Edited settings file. Skip this reload.",
          document.fileName
        );
        return;
      }
      panel.webview.postMessage({
        type: CONST_WEBVIEW.POST_MESSAGE.TYPE.RELOAD,
      });
    });
  }
}
