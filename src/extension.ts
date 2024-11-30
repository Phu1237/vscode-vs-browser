// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as extensionHelper from "./helpers/extension";

// Create output channel
const outputConsole = vscode.window.createOutputChannel("VS Browser");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  outputConsole.appendLine("Activated!");

  // Check if the extension is updated
  extensionHelper.onVersionChanged(context, outputConsole);

  // Register Serializers for webviews type
  extensionHelper.registerWebviewPanelSerializers(context);

  // Register Status bar items
  extensionHelper.registerStatusBarItems(context);

  // Register Commands
  extensionHelper.registerCommands(context);

  // Register Views
  extensionHelper.registerViewContainer(context);

  // Watch configuration changes
  vscode.workspace.onDidChangeConfiguration(
    extensionHelper.handleConfigurationChange
  );

  extensionHelper.updateContextKey();
}

// this method is called when your extension is deactivated
export function deactivate() {}
