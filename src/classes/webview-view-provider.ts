import {
  CancellationToken,
  ExtensionContext,
  WebviewView,
  WebviewViewResolveContext,
} from "vscode";

import Data from "../types/data";
import { bindWebviewEvents } from "../helpers/webview";

class WebviewViewProvider {
  constructor(
    private readonly template: Function,
    private readonly context: ExtensionContext,
    private readonly data: Data
  ) {}

  // Resolves and sets up the Webview
  resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ): void {
    // Configure Webview options
    webviewView.webview.options = {
      enableScripts: true,
    };
    const state = (context.state as Data) || this.data;
    // Set the Webview content
    bindWebviewEvents(webviewView, this.template, this.context, state);
  }
}

export default WebviewViewProvider;
