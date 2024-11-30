import * as vscode from "vscode";
import * as webviewHelper from "./webview";

import WebviewPanelSerializer from "../classes/webview-panel-serializer";
import WebviewViewProvider from "../classes/webview-view-provider";

import CONST_WEBVIEW from "../constants/webview";

import browserWebview from "../webviews/browser";
import changesWebview from "../webviews/changes";

export const startStatusBarItem: vscode.StatusBarItem =
  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

/**
 * Watch the extension version is changed
 *
 * @param context VS Code context
 * @param outputConsole output console
 */
export function onVersionChanged(
  context: vscode.ExtensionContext,
  outputConsole: vscode.OutputChannel
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");
  let oldVersion = context.globalState.get<string>("version");
  let extensionVersion = context.extension.packageJSON.version;
  let forceShowChanges = false;
  let showUpdateChanges = configs.get("showUpdateChanges");
  if (
    (oldVersion !== extensionVersion && showUpdateChanges) ||
    forceShowChanges
  ) {
    context.globalState.update("version", extensionVersion);
    outputConsole.appendLine("> Extension is updated to " + extensionVersion);
    webviewHelper.createWebviewPanel(changesWebview, context, {
      viewType: "changes",
      title: "VS Browser - New version changes",
      localProxyServerEnabled: false,
      columnToShowIn: "Active",
    });
  }
}

/**
 * Register Serializers for webviews type
 *
 * @param context VS Code context
 */
export function registerWebviewPanelSerializers(
  context: vscode.ExtensionContext
) {
  vscode.window.registerWebviewPanelSerializer(
    "vs-browser.browser",
    new WebviewPanelSerializer(context)
  );
  vscode.window.registerWebviewPanelSerializer(
    "vs-browser.proxy",
    new WebviewPanelSerializer(context)
  );
  vscode.window.registerWebviewPanelSerializer(
    "vs-browser.withoutproxy",
    new WebviewPanelSerializer(context)
  );
}

/**
 * Register Commands
 *
 * @param context VS Code context
 */
export function registerCommands(context: vscode.ExtensionContext) {
  let start = vscode.commands.registerCommand("vs-browser.start", () => {
    // Create and show a new webview
    webviewHelper.createWebviewPanel(
      browserWebview,
      context,
      CONST_WEBVIEW.CONFIG.BASE.BROWSER
    );
  });
  context.subscriptions.push(start);

  // vs-browser.startWithProxy
  let startWithProxy = vscode.commands.registerCommand(
    "vs-browser.startWithProxy",
    () => {
      // Create and show a new webview
      webviewHelper.createWebviewPanel(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.PROXY
      );
    }
  );
  context.subscriptions.push(startWithProxy);

  // vs-browser.startWithoutProxy
  let startWithoutProxy = vscode.commands.registerCommand(
    "vs-browser.startWithoutProxy",
    () => {
      // Create and show a new webview
      webviewHelper.createWebviewPanel(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.WITHOUT_PROXY
      );
    }
  );
  context.subscriptions.push(startWithoutProxy);
  // vs-browser.resetViewLocations
  let resetViewLocation = vscode.commands.registerCommand(
    "vs-browser.resetViewLocations",
    () => {
      vscode.commands.executeCommand("vs-browser-browser.resetViewLocation");
      vscode.commands.executeCommand("vs-browser-proxy.resetViewLocation");
      vscode.commands.executeCommand(
        "vs-browser-without-proxy.resetViewLocation"
      );
    }
  );
  context.subscriptions.push(resetViewLocation);
}

/**
 * Register Status bar items
 *
 * @param context VS Code context
 */
export function registerStatusBarItems(context: vscode.ExtensionContext) {
  // register a new status bar item that we can now manage
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

/**
 * Register View Container
 *
 * @param context VS Code context
 */
export function registerViewContainer(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-browser-browser",
      new WebviewViewProvider(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.BROWSER
      )
    )
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-browser-proxy",
      new WebviewViewProvider(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.PROXY
      )
    )
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-browser-without-proxy",
      new WebviewViewProvider(
        browserWebview,
        context,
        CONST_WEBVIEW.CONFIG.BASE.WITHOUT_PROXY
      )
    )
  );
}

/**
 * Handle when the configuration change
 *
 * @param event An event describing the change in Configuration
 */
export function handleConfigurationChange(
  event: vscode.ConfigurationChangeEvent
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");
  if (event.affectsConfiguration("vs-browser.showViewContainer")) {
    updateContextKey();
  } else if (event.affectsConfiguration("vs-browser.showStatusBarItem")) {
    const showStatusBarItem = configs.get<boolean>("showStatusBarItem");
    if (!showStatusBarItem) {
      startStatusBarItem.hide();
    } else {
      startStatusBarItem.show();
    }
  }
}

/**
 * Update VS Code context key to use when in package.json
 */
export function updateContextKey() {
  const configs = vscode.workspace.getConfiguration("vs-browser");
  const showViewContainer = configs.get<boolean>("showViewContainer");

  vscode.commands.executeCommand(
    "setContext",
    "config.vs-browser.showViewContainer",
    showViewContainer
  );
}
