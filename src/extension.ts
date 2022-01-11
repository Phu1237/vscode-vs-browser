// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { webView, emptyWebView } from './panel';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('VS Browser: Activated!');

	// Track currently webview panel
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// And make sure we register a serializer for our webview type
	vscode.window.registerWebviewPanelSerializer('vs-browser', new VSBrowserSerializer(context));
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vs-browser.start', () => {
		// Redirect to exíted column or create new
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it in the target column
		if (currentPanel) {
			currentPanel.reveal(columnToShowIn);
		} else {
			// Create and show a new webview
			const panel = vscode.window.createWebviewPanel(
				'vs-browser', // Identifies the type of the webview. Used internally
				'VS Browser', // Title of the panel displayed to the user
				vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
				{
					enableScripts: true,
					// freeze when panel not focused
					retainContextWhenHidden: true
				});

			// And set its HTML content
			panel.webview.html = getWebViewContent(panel.webview, context.extensionUri);

			// Handle messages from the webview
			panel.webview.onDidReceiveMessage(
				message => {
					switch (message.command) {
						case 'go-to-preferences':
							console.log('Click on Go to Preferences button');
							vscode.commands.executeCommand('workbench.action.openSettings', 'vs-browser');
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

			// Display a message box to the user
			// vscode.window.showInformationMessage('VS Browser: Running') + '...';
			panel.onDidDispose(
				() => {
					// When the panel is closed, cancel any future updates to the webview content
				},
				null,
				context.subscriptions
			);
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function showMessage(type: string, message: string, options: Object) {
	const configs = vscode.workspace.getConfiguration("vs-browser");
	let showMessageDialog = configs.get("showMessageDialog") || false;
	if (showMessageDialog) {
		switch (type) {
			case 'error':
				vscode.window.showErrorMessage(message, options);
				break;
			case 'warning':
				vscode.window.showWarningMessage(message, options);
				break;
			default:
				vscode.window.showInformationMessage(message, options);
		}
	}
}

function getWebViewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
	// Get current config
	const configs = vscode.workspace.getConfiguration("vs-browser");
	const url = configs.get<string>("url");
	const proxy = configs.get<boolean>("proxy") || false;
	const reload = configs.get<boolean>("reload.enableAutoReload") || false;
	const reloadDuration = configs.get<number>("reload.time") || 10000;
	// And get the special URI to use with the webview
	const assets: Object = {
		'proxy': webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '/src/assets', 'proxy.js')),
		'image': webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '/src/assets', 'img.jpg'))
	};
	console.log(assets);

	return url ? webView(url, proxy, reload, reloadDuration, assets) : emptyWebView();
}

class VSBrowserSerializer implements vscode.WebviewPanelSerializer {
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}
	async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
		// `state` is the state persisted using `setState` inside the webview
		console.log(`Got state: ${state}`);

		// Restore the content of our webview.
		//
		// Make sure we hold on to the `webviewPanel` passed in here and
		// also restore any event listeners we need on it.
		webviewPanel.webview.html = getWebViewContent(webviewPanel.webview, this.context.extensionUri);
		// Handle messages from the webview
		webviewPanel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'go-to-preferences':
						console.log('Click on Go to Preferences button');
						vscode.commands.executeCommand('workbench.action.openSettings', 'vs-browser');
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
			this.context.subscriptions
		);

		// Display a message box to the user
		// vscode.window.showInformationMessage('VS Browser: Running') + '...';
		webviewPanel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
			},
			null,
			this.context.subscriptions
		);
	}
}