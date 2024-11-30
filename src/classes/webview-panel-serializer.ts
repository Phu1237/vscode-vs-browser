import {
  ExtensionContext,
  WebviewPanel,
  WebviewPanelSerializer as VscodeWebviewPanelSerializer,
} from "vscode";

import * as webviewHelper from "../helpers/webview";

import browserWebview from "../webviews/browser";

class WebviewPanelSerializer implements VscodeWebviewPanelSerializer {
  private context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }
  async deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any) {
    // `state` is the state persisted using `setState` inside the webview
    console.log("Got state: " + JSON.stringify(state));

    // Restore the content of our webview.
    //
    // Make sure we hold on to the `webviewPanel` passed in here and
    // also restore any event listeners we need on it.
    webviewPanel = webviewHelper.createWebviewPanel(
      browserWebview,
      this.context,
      state,
      webviewPanel
    );
  }
}

export default WebviewPanelSerializer;
