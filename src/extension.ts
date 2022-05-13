// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as statusBarItemHelper from './helpers/statusBarItem';
import * as webviewHelper from './helpers/webview';

import browserWebview from './webviews/browser';
import changesWeview from './webviews/changes';

// Create output channel
const outputConsole = vscode.window.createOutputChannel('VS Browser');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  outputConsole.appendLine('Activated!');

  // Check if the extension is updated
  let oldVersion = context.globalState.get<string>('version');
  let extensionVersion = context.extension.packageJSON.version;
  let showChanges = false;
  if (oldVersion !== extensionVersion || showChanges) {
    context.globalState.update('version', extensionVersion);
    outputConsole.appendLine('> Extension is updated to ' + extensionVersion);
    webviewHelper.createWebviewPanel(changesWeview, context, {
      viewType: 'changes',
      title: 'VS Browser - New version changes',
      version: extensionVersion,
      startServer: false,
      columnToShowIn: 'Active',
    });
  }

  // Create a start status bar item
  statusBarItemHelper.createStartStatusBarItem(context);

  // And make sure we register a serializer for our webview type
  vscode.window.registerWebviewPanelSerializer('vs-browser.browser', new VSBrowserSerializer(context));
  vscode.window.registerWebviewPanelSerializer('vs-browser.proxy', new VSBrowserSerializer(context));
  vscode.window.registerWebviewPanelSerializer('vs-browser.withoutproxy', new VSBrowserSerializer(context));
  // The command has been defined in the package.json file

  // vs-browser.start
  let start = vscode.commands.registerCommand('vs-browser.start', () => {
    // Create and show a new webview
    webviewHelper.createWebviewPanel(browserWebview, context, {
      viewType: 'browser',
      title: 'VS Browser',
    });
  });
  context.subscriptions.push(start);

  // vs-browser.startWithProxy
  let startWithProxy = vscode.commands.registerCommand('vs-browser.startWithProxy', () => {
    // Create and show a new webview
    webviewHelper.createWebviewPanel(browserWebview, context, {
      viewType: 'proxy',
      title: 'VS Browser - Proxy',
      proxy: true
    });
  });
  context.subscriptions.push(startWithProxy);

  // vs-browser.startWithoutProxy
  let startWithoutProxy = vscode.commands.registerCommand('vs-browser.startWithoutProxy', () => {
    // Create and show a new webview
    webviewHelper.createWebviewPanel(browserWebview, context, {
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
    webviewPanel = webviewHelper.createWebviewPanel(browserWebview, this.context, state, webviewPanel);
  }
}
