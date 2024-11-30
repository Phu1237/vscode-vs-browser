import * as vscode from "vscode";
import Data, { FavouriteData } from "../types/data";
import { readFileSync } from "fs";
import CONST_WEBVIEW from "../constants/webview";

function convertVarToHTML(v: any): string {
  var type = typeof v;
  switch (type) {
    case "string":
      return v;
  }
  return String(v);
}

function getFavourites(
  workspaceFolder?: vscode.WorkspaceFolder
): FavouriteData {
  let favorites = {};
  const configs = vscode.workspace.getConfiguration("vs-browser.favourites");
  const configsFavouritesList = configs.get<FavouriteData>("list") ?? {};
  favorites = {
    ...configsFavouritesList,
  };

  // Not supported yet
  if (workspaceFolder) {
    const workspaceConfigs = vscode.workspace.getConfiguration(
      "vs-browser.favourites",
      workspaceFolder
    );
    const workspaceConfigsFavouritesList =
      workspaceConfigs.get<FavouriteData>("list") ?? {};
    favorites = {
      ...workspaceConfigsFavouritesList,
    };
  }

  return favorites;
}

export default (webviewContext: WebviewContext, data: Data) => {
  // Render asset url
  function asset(path: string): string {
    return webviewContext.webviewUri + path;
  }
  // Data
  const viewType: string = data["viewType"];
  const title: string = data["title"];
  // Get current config
  const configs = vscode.workspace.getConfiguration("vs-browser");
  const proxyMode: boolean =
    data["proxyMode"] !== undefined
      ? data["proxyMode"]
      : configs.get<boolean>("proxyMode") || false;
  const url: string =
    data["url"] !== undefined
      ? data["url"]
      : configs.get<string>("url") || "http://localhost";
  const favourites: FavouriteData =
    data["favourites"] !== undefined ? data["favourites"] : getFavourites();
  const autoCompleteUrl: string =
    data["autoCompleteUrl"] !== undefined
      ? data["autoCompleteUrl"]
      : configs.get<string>("autoCompleteUrl") || "http://";
  const localProxyServerEnabled: boolean =
    data["localProxyServerEnabled"] !== undefined
      ? data["localProxyServerEnabled"]
      : configs.get<boolean>("localProxyServer.enabled") || false;
  const localProxyServerPort: number =
    data["localProxyServerPort"] !== undefined
      ? data["localProxyServerPort"]
      : configs.get<number>("localProxyServer.port") || 9999;
  const localProxyServerForceLocation: boolean =
    data["localProxyServerForceLocation"] !== undefined
      ? data["localProxyServerForceLocation"]
      : configs.get<boolean>("localProxyServer.forceLocation") || false;
  const autoReloadDurationEnabled: boolean =
    data["autoReloadDurationEnabled"] !== undefined
      ? data["autoReloadDurationEnabled"]
      : configs.get<boolean>("reload.autoReloadDurationEnabled") || false;
  const autoReloadDurationTime: number =
    data["autoReloadDurationTime"] !== undefined
      ? data["autoReloadDurationTime"]
      : configs.get<number>("reload.autoReloadDurationTime") || 15000;

  const replaceObject: ReplaceObject = {
    codiconsCss: asset("node_modules/@vscode/codicons/dist/codicon.css"),
    browserCss: asset("assets/css/browser.css"),
    jqueryJS: asset("assets/js/jquery-3.7.1.slim.min.js"),
    proxyJS: asset("assets/js/proxy.js"),
    localProxyServerScript:
      localProxyServerEnabled === true
        ? `<script>window.localProxy = 'http://localhost:${localProxyServerPort}/'</script>`
        : "",
    localProxyServerForceLocationScript: `<script>window.forceLocation = ${localProxyServerForceLocation}</script>`,
    proxyMode: proxyMode,
    url: `'${url}'`,
    favourites: JSON.stringify(favourites),
    autoCompleteUrl: `'${autoCompleteUrl}'`,
    localProxyServerEnabled: localProxyServerEnabled,
    localProxyServerPort: localProxyServerPort,
    localProxyServerForceLocation: localProxyServerForceLocation,
    autoReloadDurationEnabled: autoReloadDurationEnabled,
    autoReloadDurationTime: autoReloadDurationTime,
    viewType: `'${viewType}'`,
    title: `'${title}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_FAVOURITE_ADD: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.FAVOURITE_ADD}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_FAVOURITE_REMOVE: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.FAVOURITE_REMOVE}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_GO_TO_SETTINGS: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.GO_TO_SETTINGS}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_OPEN_INSPECTOR: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.OPEN_INSPECTOR}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_REFRESH_FAVOURITES: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.REFRESH_FAVOURITES}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_RELOAD: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.RELOAD}'`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONST_WEBVIEW_POST_MESSAGE_TYPE_SHOW_MESSAGE_BOX: `'${CONST_WEBVIEW.POST_MESSAGE.TYPE.SHOW_MESSAGE_BOX}'`,
  };

  let html = readFileSync(
    webviewContext.extensionPath + "assets/browser.html",
    "utf8"
  );
  for (const key in replaceObject) {
    html = html.replace(
      new RegExp(`{ ${key} }`, "g"),
      convertVarToHTML(replaceObject[key])
    );
  }

  console.log(html);

  return html;
};
