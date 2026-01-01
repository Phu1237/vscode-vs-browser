import * as vscode from "vscode";
import * as webviewHelper from "./webview";

import { extractURLs } from "./common";
import { CustomTerminalLink, handleLink } from "./link";

import WebviewPanelSerializer from "../classes/webview-panel-serializer";
import WebviewViewProvider from "../classes/webview-view-provider";

import CONST_WEBVIEW from "../constants/webview";

import browserWebview from "../webviews/browser";
import changesWebview from "../webviews/changes";

import Data from "../types/data";

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
  let start = vscode.commands.registerCommand("vs-browser.start", (args) => {
    const state: Data = CONST_WEBVIEW.CONFIG.BASE.BROWSER;
    if (args && args.url) {
      state.url = args.url;
    }
    webviewHelper.createWebviewPanel(browserWebview, context, state);
  });
  context.subscriptions.push(start);

  // vs-browser.startWithProxy
  let startWithProxy = vscode.commands.registerCommand(
    "vs-browser.startWithProxy",
    (args) => {
      const state: Data = CONST_WEBVIEW.CONFIG.BASE.PROXY;
      if (args && args.url) {
        state.url = args.url;
      }
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
    (args) => {
      const state: Data = CONST_WEBVIEW.CONFIG.BASE.WITHOUT_PROXY;
      if (args && args.url) {
        state.url = args.url;
      }
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

/////////////////////////////
// Document Link Providers //
/////////////////////////////
const registeredDocumentLinkProviders: vscode.Disposable[] = [];
/**
 * Register Document Link Providers
 */
export function registerDocumentLinkProviders(
  context: vscode.ExtensionContext
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");

  const isLinkEnabled = configs.get<boolean>("link.enabled");
  const isOpenInDocument =
    configs.get<string>("link.openIn") === "default" ||
    configs.get<string>("link.openIn") === "document";
  if (!isLinkEnabled || (isLinkEnabled && !isOpenInDocument)) {
    return;
  }
  // Register command to open link
  registeredDocumentLinkProviders.push(
    vscode.commands.registerCommand("vs-browser.openLink", async ({ url }) => {
      await handleLink(context, {
        data: url,
      });
    })
  );
  registeredDocumentLinkProviders.push(
    vscode.languages.registerDocumentLinkProvider(
      { pattern: "*" },
      {
        provideDocumentLinks(document) {
          const matches = extractURLs(document.getText());

          return matches.map((match) => {
            const args = { url: match[0] };
            return {
              range: new vscode.Range(
                document.positionAt(match.index ?? 0),
                document.positionAt((match.index ?? 0) + match[0].length)
              ),
              tooltip: "Open Link in VS Browser",
              target: vscode.Uri.parse(
                `command:vs-browser.openLink?${JSON.stringify(args)}`
              ),
            } as vscode.DocumentLink;
          });
        },
      }
    )
  );
}

/**
 * Unregister Document Link Providers
 */
export function unregisterDocumentLinkProviders() {
  let disposable;
  while ((disposable = registeredDocumentLinkProviders.pop())) {
    disposable.dispose();
  }
}

/////////////////////////////
// Terminal Link Providers //
/////////////////////////////
const registeredTerminalLinkProviders: vscode.Disposable[] = [];
/**
 * Register Terminal Link Providers
 *
 * @param context VS Code context
 */
export function registerTerminalLinkProviders(
  context: vscode.ExtensionContext,
  outputConsole: vscode.OutputChannel
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");

  const isLinkEnabled = configs.get<boolean>("link.enabled");
  const isOpenInTerminal =
    configs.get<string>("link.openIn") === "default" ||
    configs.get<string>("link.openIn") === "terminal";
  if (!isLinkEnabled || (isLinkEnabled && !isOpenInTerminal)) {
    return;
  }
  registeredTerminalLinkProviders.push(
    vscode.window.registerTerminalLinkProvider(
      new (class implements vscode.TerminalLinkProvider<CustomTerminalLink> {
        provideTerminalLinks(
          context: vscode.TerminalLinkContext,
          _token: vscode.CancellationToken
        ) {
          const matches = extractURLs(context.line);

          return matches.map((match) => {
            outputConsole.appendLine("Clicked to link: " + match[0]);

            return {
              data: match[0],
              startIndex: match.index,
              tooltip: "Open Link in VS Browser",
              length: match[0].length,
            } as vscode.TerminalLink;
          }) as vscode.ProviderResult<CustomTerminalLink[]>;
        }
        async handleTerminalLink(link: CustomTerminalLink) {
          await handleLink(context, link);
        }
      })()
    )
  );
}

/**
 * Unregister Terminal Link Providers
 */
export function unregisterTerminalLinkProviders() {
  registeredTerminalLinkProviders.forEach((disposable) => {
    disposable.dispose();
  });
}

/**
 * Handle when the configuration change
 *
 * @param event An event describing the change in Configuration
 */
export function handleConfigurationChange(
  context: vscode.ExtensionContext,
  outputConsole: vscode.OutputChannel,
  event: vscode.ConfigurationChangeEvent
) {
  const configs = vscode.workspace.getConfiguration("vs-browser");
  if (
    event.affectsConfiguration("vs-browser.link.enabled") ||
    event.affectsConfiguration("vs-browser.link.openIn")
  ) {
    const isEnabled = configs.get<boolean>("link.enabled");
    if (!isEnabled || event.affectsConfiguration("vs-browser.link.openIn")) {
      unregisterDocumentLinkProviders();
      unregisterTerminalLinkProviders();
    }
    registerDocumentLinkProviders(context);
    registerTerminalLinkProviders(context, outputConsole);
  }
  if (event.affectsConfiguration("vs-browser.showViewContainer")) {
    updateContextKey();
  }
  if (event.affectsConfiguration("vs-browser.showStatusBarItem")) {
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
