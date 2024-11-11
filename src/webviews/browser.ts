import * as vscode from 'vscode';
import Data from "../types/data";
import * as CONST_WEBVIEW from "../constants/webview";
import changeColorSchemeJs from "../constants/assets/js/change_color_scheme";

export default (webviewUri: string, data: Data) => {
  // Render asset url
  function asset(path: string): string {
    return webviewUri + path;
  }
  // Get current config
  const configs = vscode.workspace.getConfiguration("vs-browser");
  const proxyMode: boolean = data['proxyMode'] !== undefined ? data['proxyMode'] : configs.get<boolean>("proxyMode") || false;
  const url: string = data['url'] !== undefined ? data['url'] : configs.get<string>("url") || 'http://localhost';
  const autoCompleteUrl: string = data['autoCompleteUrl'] !== undefined ? data['autoCompleteUrl'] : configs.get<string>("autoCompleteUrl") || 'http://';
  const colorScheme: any = data['colorScheme'] !== undefined ? data['colorScheme'] : JSON.stringify(configs.get("colorScheme") || {});
  const localProxyServerEnabled: boolean = data['localProxyServerEnabled'] !== undefined ? data['localProxyServerEnabled'] : configs.get<boolean>("localProxyServer.enabled") || false;
  const localProxyServerPort: number = data['localProxyServerPort'] !== undefined ? data['localProxyServerPort'] : configs.get<number>("localProxyServer.port") || 9999;
  const localProxyServerForceLocation: boolean = data['localProxyServerForceLocation'] !== undefined ? data['localProxyServerForceLocation'] : configs.get<boolean>("localProxyServer.forceLocation") || false;
  const autoReloadDurationEnabled: boolean = data['autoReloadDurationEnabled'] !== undefined ? data['autoReloadDurationEnabled'] : configs.get<boolean>("reload.autoReloadDurationEnabled") || false;
  const autoReloadDurationTime: number = data['autoReloadDurationTime'] !== undefined ? data['autoReloadDurationTime'] : configs.get<number>("reload.autoReloadDurationTime") || 15000;

  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${asset('assets/css/browser.css')}">
    <script src="${asset('assets/js/jquery-3.7.1.slim.min.js')}"></script>

    `
    + (localProxyServerEnabled === true ? `
    <script>window.localProxy = 'http://localhost:${localProxyServerPort}/'</script>` : '') +
    `

    <script>window.forceLocation = ${localProxyServerForceLocation}</script>
</head>

<body>
    <div id="navbar">
        <button id="btn-reload" title="Reload">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
        </button>
        <!-- addressbar -->
        <input type="text" id="addressbar" placeholder="Url" />
        <!-- go to url -->
        <button id="btn-go" title="Go to URL">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
            </svg>
        </button>
        <!-- switch color scheme -->
        <button id="btn-color-scheme">
          <svg
              data-name="color-scheme"
              data-value="light"
              xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-lightbulb hidden" viewBox="0 0 16 16"
          >
            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
          </svg>
          <svg
              data-name="color-scheme"
              data-value="dark"
              xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-lightbulb-fill hidden" viewBox="0 0 16 16"
          >
            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"/>
          </svg>
        </button>
        <button id="btn-inspect" title="Inspect">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bug" viewBox="0 0 16 16">
                <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A4.979 4.979 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A4.985 4.985 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623zM4 7v4a4 4 0 0 0 3.5 3.97V7H4zm4.5 0v7.97A4 4 0 0 0 12 11V7H8.5zM12 6a3.989 3.989 0 0 0-1.334-2.982A3.983 3.983 0 0 0 8 2a3.983 3.983 0 0 0-2.667 1.018A3.989 3.989 0 0 0 4 6h8z" />
            </svg>
        </button>
        <button id="btn-go-to-settings" title="Go to Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
            </svg>
        </button>
    </div>
    <div class="webview-container">
        <iframe is="using-proxy" id="webview" frameborder="0"></iframe>
    </div>
    <script>
        $(document).ready(function() {
            const vscode = acquireVsCodeApi(); // VS Code API

            let iframe = $('#webview');

            let btn_reload = $('#btn-reload');
            let btn_go = $('#btn-go');
            let btn_inspect = $('#btn-inspect');
            let btn_color_scheme = $('#btn-color-scheme');
            let btn_go_to_settings = $('#btn-go-to-settings');

            // Set address
            let addressbar = $('#addressbar');
            let url = autoCompleteUrl('${url}');
            addressbar.val('${url}');
            iframe.attr('src', '${url}');

            // Set color scheme
            function getColorScheme(url) {
              const validColorSchemeList = [
                'system',
                'light',
                'dark',
              ];

              let colorSchemeList = ${colorScheme};
              if (colorSchemeList.hasOwnProperty(url)) {
                let colorScheme = colorSchemeList[url].toLowerCase();
                if (colorScheme && validColorSchemeList.includes(colorScheme)) {
                  return colorScheme;
                }
              }
              return 'system';
            }
            let color_scheme = getColorScheme(url);
            function setColorSchemeIcon() {
              $('[data-name="color-scheme"]').each(function () {
                let current_color_scheme = color_scheme;
                let color = $(this).data('value');
                if (current_color_scheme !== 'system') {
                  btn_color_scheme.addClass('active');
                } else {
                  btn_color_scheme.removeClass('active');
                  current_color_scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (color === current_color_scheme) {
                  $(this).removeClass('hidden');
                } else {
                  $(this).addClass('hidden');
                }
              });
            }
            function applyPreferredColorScheme(scheme) {
              for (var s = 0; s < document.styleSheets.length; s++) {
                  try {
                    document.styleSheets[s].cssRules.length;
                  } catch {
                    continue;
                  }
                  for (var i = 0; i < document.styleSheets[s].cssRules.length; i++) {
                      rule = document.styleSheets[s].cssRules[i];
                      if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme")) {
                          switch (scheme) {
                              case "light":
                                  rule.media.appendMedium("original-prefers-color-scheme");
                                  if (rule.media.mediaText.includes("light")) rule.media.deleteMedium("(prefers-color-scheme: light)");
                                  if (rule.media.mediaText.includes("dark")) rule.media.deleteMedium("(prefers-color-scheme: dark)");
                                  break;
                              case "dark":
                                  rule.media.appendMedium("(prefers-color-scheme: light)");
                                  rule.media.appendMedium("(prefers-color-scheme: dark)");
                                  if (rule.media.mediaText.includes("original")) rule.media.deleteMedium("original-prefers-color-scheme");
                                  break;
                              default:
                                  rule.media.appendMedium("(prefers-color-scheme: dark)");
                                  if (rule.media.mediaText.includes("light")) rule.media.deleteMedium("(prefers-color-scheme: light)");
                                  if (rule.media.mediaText.includes("original")) rule.media.deleteMedium("original-prefers-color-scheme");
                                  break;
                          }
                      }
                  }
              }
            }
            function setColorScheme() {
              setColorSchemeIcon();
              applyPreferredColorScheme(color_scheme);
            }
            setColorScheme();

            function setVSCodeState(options) {
              vscode.setState({
                proxyMode: ${proxyMode},
                url: '${url}',
                autoCompleteUrl: '${autoCompleteUrl}',
                localProxyServerEnable: ${localProxyServerEnabled},
                localProxyServerPort: ${localProxyServerPort},
                autoReloadDurationEnabled: ${autoReloadDurationEnabled},
                autoReloadDurationTime: ${autoReloadDurationTime},
                viewType: '${data['viewType']}',
                title: '${data['title']}',
                ...options,
              });
            }
            // Set a restore point for the webview
            setVSCodeState({
              url: url,
            });

            if (${autoReloadDurationEnabled}) {
              btn_reload.addClass('active');
            }
            if (${proxyMode}) {
              // Watch to update addressbar
              const observer = new MutationObserver(function () {
                let url = iframe.getAttribute('srcurl') || '${url}';
                addressbar.value = url;

                let proxyMode = ${proxyMode};
                if (url && url.match(/^http:\/\/localhost/g)) {
                  proxyMode = false;
                }
                setVSCodeState({
                  proxyMode: proxyMode,
                  url: url,
                });
              });
              observer.observe(iframe[0], {
                attributes: true,
                attributeFilter: ['srcurl']
              });
              // Append proxy script to the page content
              let script = $('<script type="module" src="${asset('assets/js/proxy.js')}" />');
              $('body').append(script);
            }

            // Receive message from webview
            window.addEventListener('message', event => {
              const message = event.data; // The JSON data our extension sent

              switch (message.command) {
                case "` + CONST_WEBVIEW.POST_MESSAGE.COMMAND.RELOAD +`":
                  reloadIframe();
                  break;
                case "` + CONST_WEBVIEW.POST_MESSAGE.COMMAND.SET_COLOR_SCHEME +`":
                  color_scheme = message.value;
                  setColorScheme();
                  break;
              }
            });
            addressbar.on("keyup", function (event) {
              // Number 13 is the "Enter" key on the keyboard
              if (event.keyCode === 13) {
                // Cancel the default action, if needed
                event.preventDefault();
                addressbar.blur();
                // Trigger the button element with a click
                btn_go.click();
              }
            });

            /**
             * Button handler
             */
            btn_reload.on('click', function () {
              reloadIframe();
            });
            btn_go.on('click', function () {
              let url = addressbar.val();
              reloadIframe(url);
              color_scheme = getColorScheme(url);
              setColorScheme();
              if (!${proxyMode}) {
                setVSCodeState({
                  url: url,
                });
              }
            });
            btn_color_scheme.on('click', function () {
              vscode.postMessage({
                command: 'switch-color-scheme',
                value: url,
              });
            });
            btn_inspect.on('click', function () {
              vscode.postMessage({
                command: 'open-inspector',
              });
            });
            btn_go_to_settings.on('click', function () {
              vscode.postMessage({
                command: 'go-to-settings'
              })
            });

            // Just run when iframe first loaded
            iframe.on('load', function () {
              btn_reload.removeClass('loading');
              if (${autoReloadDurationEnabled}) {
                setTimeout(reloadIframe, ${autoReloadDurationTime});
              }
              const changeColorSchemeFunction = $("<script />", {
                html: ` + changeColorSchemeJs + `
              });
              
              $(this)[0].appendChild(changeColorSchemeFunction[0]);
              $(this)[0].appendChild(document.createElement('img'));
            });

            function autoCompleteUrl(baseUrl) {
              return baseUrl.replace(/^(?:(.*:)?\\\/\\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => {
                return schemma ? match : '${autoCompleteUrl}' + nonSchemmaUrl;
              });
            }

            function reloadIframe(src = addressbar.val()) {
              btn_reload.addClass('loading');
              iframe.attr('src', autoCompleteUrl(src));
              url = autoCompleteUrl(src);
              console.log('reloadIframe: ' + autoCompleteUrl(src));
            }
        });
    </script>
</body>

</html>
  `;
};
