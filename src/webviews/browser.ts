import Data from "../types/data";
import * as vscode from 'vscode';

export default (webviewUri: string, data: Data) => {
  // Render asset url
  function asset(path: string) {
    return webviewUri + path;
  }
  // Get current config
  const configs = vscode.workspace.getConfiguration("vs-browser");
  const proxyMode: boolean = data['proxyMode'] !== undefined ? data['proxyMode'] : configs.get<boolean>("proxyMode") || false;
  const url: string = data['url'] !== undefined ? data['url'] : configs.get<string>("url") || 'http://localhost';
  const autoCompleteUrl: string = data['autoCompleteUrl'] !== undefined ? data['autoCompleteUrl'] : configs.get<string>("autoCompleteUrl") || 'http://';
  const localProxyServerEnabled: boolean = data['localProxyServerEnabled'] !== undefined ? data['localProxyServerEnabled'] : configs.get<boolean>("localProxyServer.enabled") || false;
  const localProxyServerPort: number = data['localProxyServerPort'] !== undefined ? data['localProxyServerPort'] : configs.get<number>("localProxyServer.port") || 9999;
  const localProxyServerForceLocation: boolean = data['localProxyServerForceLocation'] !== undefined ? data['localProxyServerForceLocation'] : configs.get<boolean>("localProxyServer.forceLocation") || false;
  const reloadAutoReloadEnabled: boolean = data['reloadAutoReloadEnabled'] !== undefined ? data['reloadAutoReloadEnabled'] : configs.get<boolean>("reload.autoReloadEnabled") || false;
  const reloadAutoReloadDurationTime: number = data['reloadAutoReloadDurationTime'] !== undefined ? data['reloadAutoReloadDurationTime'] : configs.get<number>("reload.autoReloadDurationTime") || 15000;

  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${asset('assets/css/browser.css')}">

    `
    + (localProxyServerEnabled === true ? `
    <script>window.localProxy = 'http://localhost:${localProxyServerPort}/'</script>` : '') +
    `

    <script>window.forceLocation = ${localProxyServerForceLocation}</script>
</head>

<body>
    <div id="navbar">
        <button id="btn-reload" onclick="reloadIframe()" title="Reload">
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
        const vscode = acquireVsCodeApi(); // VS Code API
        let url =  autoCompleteUrl('${url}');
        let iframe = document.getElementById('webview');
        let error = document.getElementById('webview-failed-load');
        let btn_reload = document.getElementById('btn-reload');
        let btn_go = document.getElementById('btn-go');
        let btn_inspect = document.getElementById('btn-inspect');
        let btn_go_to_settings = document.getElementById('btn-go-to-settings');
        let addressbar = document.getElementById('addressbar');

        addressbar.value = '${url}';
        iframe.src = '${url}';

        window.onload = function () {
          // Set a restore point for the webview
          vscode.setState({
            proxyMode: ${proxyMode},
            url: url,
            autoCompleteUrl: '${autoCompleteUrl}',
            localProxyServerEnable: ${localProxyServerEnabled},
            localProxyServerPort: ${localProxyServerPort},
            reloadAutoReloadEnabled: ${reloadAutoReloadEnabled},
            reloadAutoReloadDurationTime: ${reloadAutoReloadDurationTime},
            viewType: '${data['viewType']}',
            title: '${data['title']}',
          });

          if (${reloadAutoReloadEnabled}) {
            btn_reload.classList.add('active');
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
              vscode.setState({
                proxyMode: proxyMode,
                url: url,
                autoCompleteUrl: '${autoCompleteUrl}',
                localProxyServerEnable: ${localProxyServerEnabled},
                localProxyServerPort: ${localProxyServerPort},
                reloadAutoReloadEnabled: ${reloadAutoReloadEnabled},
                reloadAutoReloadDurationTime: ${reloadAutoReloadDurationTime},
                viewType: '${data['viewType']}',
                title: '${data['title']}',
              });
            });
            observer.observe(iframe, {
              attributes: true,
              attributeFilter: ['srcurl']
            });
            // Append proxy script to the page content
            let script = document.createElement('script');
            script.type = 'module';
            script.src = '${asset('assets/proxy.js')}';
            document.querySelector('body').appendChild(script);
          }
        }

        // Receive message from webview
        window.addEventListener('message', event => {
          const message = event.data; // The JSON data our extension sent

          switch (message.command) {
            case 'reload':
              reloadIframe();
              break;
          }
        });
        addressbar.addEventListener("keyup", function (event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            addressbar.blur();
            // Trigger the button element with a click
            btn_go.click();
          }
        });
        btn_go.onclick = function () {
          let url = addressbar.value;
          reloadIframe(url);
        }
        btn_inspect.onclick = function () {
          vscode.postMessage({
            command: 'open-inspector',
          });
        }
        btn_go_to_settings.onclick = function () {
          vscode.postMessage({
            command: 'go-to-settings'
          })
        }
        // Just run when iframe first loaded
        iframe.onload = function () {
          btn_reload.classList.remove('loading');
          if (${reloadAutoReloadEnabled}) {
            setTimeout(reloadIframe, ${reloadAutoReloadDurationTime});
          }
        }

        function autoCompleteUrl(url) {
          return url.replace(/^(?:(.*:)?\\\/\\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => {
            return schemma ? match : '${autoCompleteUrl}' + nonSchemmaUrl;
          });
        }

        function reloadIframe(src = addressbar.value) {
          btn_reload.classList.add('loading');
          iframe.src = autoCompleteUrl(src);
          console.log('reloadIframe: ' + autoCompleteUrl(src));
        }
    </script>
</body>

</html>
  `;
};
