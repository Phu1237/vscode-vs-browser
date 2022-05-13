// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as server from './server';
import browserWebview from './webviews/browser';
import changesWeview from './webviews/changes';

import Data from './types/data';

// Create output channel
const outputConsole = vscode.window.createOutputChannel('VS Browser');

let startStatusBarItem: vscode.StatusBarItem;
startStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  outputConsole.appendLine('Activated!');

  // Check if the extension is updated
  let oldVersion = context.globalState.get<string>('version');
  let extensionVersion = context.extension.packageJSON.version;
  let showChanges = true;
  if (oldVersion !== extensionVersion || showChanges) {
    context.globalState.update('version', extensionVersion);
    outputConsole.appendLine('> Extension is updated to ' + extensionVersion);
    let panel = vscode.window.createWebviewPanel('vs-browser.changes', 'VS Browser - New version changes', vscode.ViewColumn.Active);

    panel = createWebviewPanel(changesWeview, context, {
      viewType: 'changes',
      title: 'VS Browser - New version changes',
      version: extensionVersion,
      startServer: false,
    });
  }

  // And make sure we register a serializer for our webview type
  vscode.window.registerWebviewPanelSerializer('vs-browser', new VSBrowserSerializer(context));
  vscode.window.registerWebviewPanelSerializer('vs-browser.proxy', new VSBrowserSerializer(context));
  vscode.window.registerWebviewPanelSerializer('vs-browser.withoutproxy', new VSBrowserSerializer(context));
  // The command has been defined in the package.json file

  // create a new status bar item that we can now manage
  const configs = vscode.workspace.getConfiguration('vs-browser');
  let showStatusBarItem = configs.get<boolean>('showStatusBarItem') || false;
  startStatusBarItem.command = 'vs-browser.start';
  startStatusBarItem.text = '$(globe) VS Browser';
  startStatusBarItem.tooltip = 'Start VS Browser';
  context.subscriptions.push(startStatusBarItem);
  if (showStatusBarItem) {
    startStatusBarItem.show();
  }
  // show/hide status bar item when config changed
  vscode.workspace.onDidChangeConfiguration(() => {
    const configs = vscode.workspace.getConfiguration('vs-browser');
    showStatusBarItem = configs.get<boolean>('showStatusBarItem') || false;
    if (!showStatusBarItem) {
      startStatusBarItem.hide();
    } else {
      startStatusBarItem.show();
    }
  });

  // vs-browser.start
  let start = vscode.commands.registerCommand('vs-browser.start', () => {
    // Create and show a new webview
    createWebviewPanel(browserWebview, context, {
      viewType: 'browser',
      title: 'VS Browser',
    });
  });
  context.subscriptions.push(start);

  // vs-browser.startWithProxy
  let startWithProxy = vscode.commands.registerCommand('vs-browser.startWithProxy', () => {
    // Create and show a new webview
    createWebviewPanel(browserWebview, context, {
      viewType: 'proxy',
      title: 'VS Browser - Proxy',
      proxy: true
    });
  });
  context.subscriptions.push(startWithProxy);

  // vs-browser.startWithoutProxy
  let startWithoutProxy = vscode.commands.registerCommand('vs-browser.startWithoutProxy', () => {
    // Create and show a new webview
    createWebviewPanel(browserWebview, context, {
      viewType: 'withoutproxy',
      title: 'VS Browser - Without proxy',
      proxy: false
    });
  });
  context.subscriptions.push(startWithoutProxy);
}

// this method is called when your extension is deactivated
export function deactivate() { }

class VSBrowserSerializer implements vscode.WebviewPanelSerializer {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    // `state` is the state persisted using `setState` inside the webview
    console.log('Got state: ' + JSON.stringify(state));

    // Restore the content of our webview.
    //
    // Make sure we hold on to the `webviewPanel` passed in here and
    // also restore any event listeners we need on it.
    webviewPanel = createWebviewPanel(browserWebview, this.context, state);
  }
}

/**
 * Inject event and context to panel
 * @param context Extension context
 * @param data Data to inject
 * @returns
 */
function createWebviewPanel(template: Function, context: vscode.ExtensionContext, data: Data) {
  // Start proxy server
  if (vscode.workspace.getConfiguration('vs-browser.localProxyServer.enabled') && data['startServer']) {
    server.start(function () {
      const configs = vscode.workspace.getConfiguration('vs-browser');
      const port = configs.get<number>('localProxyServer.port') || 9999;
      startStatusBarItem.text = '$(globe) VS Browser: ' + port;
      startStatusBarItem.color = '#00ff00';
    });
  }

  // Ccreate new column
  const configs = vscode.workspace.getConfiguration('vs-browser');
  const column = configs.get<string>('columnToShowIn') || 'Two';
  let columnToShowIn = vscode.ViewColumn.Two;
  switch (column) {
    case 'One':
      columnToShowIn = vscode.ViewColumn.One;
      break;
    case 'Two':
      columnToShowIn = vscode.ViewColumn.Two;
      break;
    case 'Three':
      columnToShowIn = vscode.ViewColumn.Three;
      break;
    case 'Active':
      columnToShowIn = vscode.ViewColumn.Active;
      break;
    case 'Beside':
      columnToShowIn = vscode.ViewColumn.Beside;
      break;
    default:
  }
  let panel = vscode.window.createWebviewPanel(
    'vsbrowser.' + data['viewType'], // Identifies the type of the webview. Used internally
    data['title'], // Title of the panel displayed to the user
    columnToShowIn, // Editor column to show the new webview panel in.
    {
      enableScripts: true,
      // freeze when panel not focused
      retainContextWhenHidden: true,
      // enable find widget
      enableFindWidget: true,
    }
  );

  panel.webview.html = getWebViewContent(template, panel.webview, context.extensionUri, data);
  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    message => {
      console.log('Received message:', message);
      switch (message.command) {
        case 'go-to-settings':
          console.log('Click on Go to Settings button');
          vscode.commands.executeCommand('workbench.action.openSettings', 'vs-browser');
          return;
        case 'open-inspector':
          console.log('Click on Open Inspector button');
          vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
          return;
        case 'show-message-box':
          let type = message.type;
          let text = message.text;
          let detail = message.detail;
          console.log(message.detail);
          showMessage(type, text, {
            detail: detail
          });
          return;
      }
    },
    undefined,
    context.subscriptions
  );
  // Handle panel state change event
  panel.onDidChangeViewState(
    e => {
      let panel = e.webviewPanel;

      switch (panel.viewColumn) {
        case vscode.ViewColumn.One:
          console.log('ViewColumn.One');
          // updateWebviewForCat(panel, 'Coding Cat');
          return;

        case vscode.ViewColumn.Two:
          console.log('ViewColumn.Two');
          // updateWebviewForCat(panel, 'Compiling Cat');
          return;

        case vscode.ViewColumn.Three:
          console.log('ViewColumn.Three');
          // updateWebviewForCat(panel, 'Testing Cat');
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
      if (vscode.workspace.getConfiguration('vs-browser.localProxyServer.enabled')) {
        server.stop(function () {
          startStatusBarItem.text = '$(globe) VS Browser';
        });
      }
    },
    null,
    context.subscriptions
  );

  // Handle when save file
  vscode.workspace.onDidSaveTextDocument(() => {
    panel.webview.postMessage({ command: 'reload' });
  });

  return panel;
}

/**
 * Get webview context
 * @param webview
 * @param extensionUri
 * @param data
 * @returns
 */
function getWebViewContent(template: Function, webview: vscode.Webview, extensionUri: vscode.Uri, data: Data) {
  // Create uri for webview
  const webviewUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '/'));

  return template(webviewUri, data);
}

/**
 * Show message box
 * @param type Type of message
 * @param message Context of message
 * @param options https://code.visualstudio.com/api/references/vscode-api#MessageOptions
 */
function showMessage(type: string, message: string, options: Object = {}) {
  const configs = vscode.workspace.getConfiguration('vs-browser');
  let showMessageDialog = configs.get<boolean>('showMessageDialog') || false;
  if (showMessageDialog) {
    switch (type) {
      case 'error':
        vscode.window.showErrorMessage(message, options);
        break;
      case 'warning':
        vscode.window.showWarningMessage(message, options);
        break;
      case 'info':
        vscode.window.showInformationMessage(message, options);
    }
  }
}
