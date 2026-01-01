import * as vscode from "vscode";
import CONST_WEBVIEW from "../constants/webview";
import * as webviewHelper from "./webview";
import Data from "../types/data";
import browserWebview from "../webviews/browser";

export type CustomLink = {
  data: string;
};

export type CustomTerminalLink = vscode.TerminalLink & CustomLink;

/**
 * Handle Link
 *
 * @param context vscode.ExtensionContext
 * @param link CustomLink
 */
export async function handleLink(
  context: vscode.ExtensionContext,
  link: CustomLink
) {
  if (link.data === "") {
    vscode.window.showErrorMessage("VS Browser: No URL found to open.");
    return;
  }
  let configs = vscode.workspace.getConfiguration("vs-browser.link");
  let openWith = configs.get<string>("openWith");
  if (configs.get<string>("openWith") === "ask") {
    openWith = await vscode.window.showQuickPick(
      [
        "default",
        "vs-browser-browser",
        "vs-browser-proxy",
        "vs-browser-without-proxy",
      ],
      {
        placeHolder: "Where do you want to open the link?",
      }
    );
  }

  let state: Data;
  switch (openWith) {
    case "vs-browser-browser":
      state = CONST_WEBVIEW.CONFIG.BASE.BROWSER;
      break;
    case "vs-browser-proxy":
      state = CONST_WEBVIEW.CONFIG.BASE.PROXY;
      break;
    case "vs-browser-without-proxy":
      state = CONST_WEBVIEW.CONFIG.BASE.WITHOUT_PROXY;
      break;
    case "default":
      vscode.env.openExternal(vscode.Uri.parse(link.data));
      return;
    default:
      return;
  }

  state.url = link.data;
  webviewHelper.createWebviewPanel(browserWebview, context, state);
}
