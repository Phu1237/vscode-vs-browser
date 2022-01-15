// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { webView, emptyWebView } from './panel';

// Create output channel
const outputConsole = vscode.window.createOutputChannel('VS Browser');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	outputConsole.appendLine('Activated!');

	// Track currently webview panel
	// let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// And make sure we register a serializer for our webview type
	vscode.window.registerWebviewPanelSerializer('vs-browser', new VSBrowserSerializer(context));
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vs-browser.start', () => {
		// Ccreate new column
		const configs = vscode.workspace.getConfiguration("vs-browser");
		const column = configs.get<string>("columnToShowIn") || 'Two';
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
		// Create and show a new webview
		let panel = vscode.window.createWebviewPanel(
			'vs-browser', // Identifies the type of the webview. Used internally
			'VS Browser', // Title of the panel displayed to the user
			columnToShowIn, // Editor column to show the new webview panel in.
			{
				enableScripts: true,
				// freeze when panel not focused
				retainContextWhenHidden: true,
				// enable find widget
				enableFindWidget: true,
			});

		// Inject event and context to panel
		panel = createWebviewPanel(panel, context);
	});

	context.subscriptions.push(disposable);
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
		console.log(`Got URL state: ${state.url}`);

		// Restore the content of our webview.
		//
		// Make sure we hold on to the `webviewPanel` passed in here and
		// also restore any event listeners we need on it.
		webviewPanel = createWebviewPanel(webviewPanel, this.context, state.url);
	}
}

/**
 * Inject event and context to panel
 * @param panel Panel which is created
 * @param context Extension context
 * @param url Url that will be open when start
 * @returns
 */
function createWebviewPanel(panel: vscode.WebviewPanel, context: vscode.ExtensionContext, url: string = '') {
	panel.webview.html = getWebViewContent(panel.webview, context.extensionUri, url);
	// Handle messages from the webview
	panel.webview.onDidReceiveMessage(
		message => {
			console.log('Received message:', message);
			switch (message.command) {
				case 'go-to-preferences':
					console.log('Click on Go to Preferences button');
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
		},
		null,
		context.subscriptions
	);
	return panel;
}

/**
 * Get webview context
 * @param webview
 * @param extensionUri
 * @param url
 * @returns
 */
function getWebViewContent(webview: vscode.Webview, extensionUri: vscode.Uri, url: string = '') {
	// Get current config
	const configs = vscode.workspace.getConfiguration("vs-browser");
	url = url !== '' ? withHttp(url) : withHttp(configs.get<string>("url") || '');
	const proxy = configs.get<boolean>("proxy") || false;
	const reload = configs.get<boolean>("reload.enableAutoReload") || false;
	const reloadDuration = configs.get<number>("reload.time") || 10000;
	// Add http to url if url don't include it
	// And get the special URI to use with the webview
	const assets: Object = {
		'proxy': webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '/src/assets', 'proxy.js')),
		'image': webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, '/src/assets', 'img.jpg'))
	};
	console.log(assets);
	outputConsole.appendLine('Go to ' + url);

	return url ? webView(url, proxy, reload, reloadDuration, assets) : emptyWebView();
}

/**
 * Show message box
 * @param type Type of message
 * @param message Context of message
 * @param options https://code.visualstudio.com/api/references/vscode-api#MessageOptions
 */
function showMessage(type: string, message: string, options: Object = {}) {
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

/**
 * Add http to the URL if it doesn't have it
 * @param url
 * @returns
 */
function withHttp(url: string): string {
	return url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => {
		return schemma ? match : `http://${nonSchemmaUrl}`
	});
}
