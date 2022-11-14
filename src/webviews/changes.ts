import Data from '../types/data';
const packageJSON = require('../../package.json');

export default (webviewUri: string, data: Data) => {
  // Render asset url
  function asset(path: string) {
    return webviewUri + path;
  }
  let extensionVersion = packageJSON.version || '0.0.0';

  let content = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        table {
            margin: auto;
            border: 1px solid;
        }

        th,
        tr:not(:last-child)>td {
            border-bottom: 1px solid;
        }

        th:not(:last-child),
        td:not(:last-child) {
            border-right: 1px solid;
        }
    </style>
</head>

<body>
    <div>
        <h1>Changes (version ${extensionVersion})</h1>
        <ul>
          <li><b>Fix</b>: Dark mode background color</li>
          <li><b>Update</b>: Extension dependencies</li>
        </ul>
    </div>
    <div>
        <h2>Usage</h2>
        <ul>
            <li>
                Open command palette (<b>Ctrl+Shift+P</b>) & enter "<b>VS Browser: Start Browser</b>"
            </li>
            <li>
                All extension settings are disable by default, you should update extension settings for a better experience
            </li>
        </ul>
        <div style="text-align: center">
            <img src="${asset('images/start-extension.gif')}" />
            <br />
            <table>
                <thead>
                    <th>Setting</th>
                    <th>Description</th>
                    <th>Default</th>
                </thead>
                <tbody>`;
  for (let property in packageJSON.contributes.configuration.properties) {
    let value = packageJSON.contributes.configuration.properties[property];
    let key = property.replace(/vs-browser\./g, '');
    let description = String(value.description) || '';
    let defaultValue = String(value.default) || '';

    content += `<tr>
                <td>${key}</td>
                <td style="text-align: left">${description}</td>
                <td>${defaultValue}</td>
            </tr>`;
  }
  content += `</tbody>
            </table>
            <div style="margin-top: 10px;">
                <button id="btn-go-to-settings">
                    Open Settings
                </button>
            </div>
        </div>
    </div>
    <div>
        <h2>*Bugs: </h2>
        <ul>
            <li>
                <b>Local Proxy server</b> have many bugs right now</b>
            </li>
            <li>
                <b>Local Proxy server</b> will not be automatically closed when you closed all the panel</b>
            </li>
            <li>
                <b>Local Proxy server</b> does not support form submit (Pure/HTML form submit) yet<br />
                <i>Notes:</i>
                <ul>
                    <li>Form without redirecting page (JS) still working</li>
                </ul>
            </li>
            <li>
                Sometimes, the dialog still displays even if nothing goes wrong<br />
                <i>Solves:</i>
                <ul>
                    <li>Turn off <b>showMessageDialogg</b> setting</li>
                    <li><b>Using Local Proxy Server</b></li>
                </ul>
            </li>
        </ul>
        I will fix these bugs as soon as possible.
    </div>
    <div>
        <h3>Donation</h3>
        This product is free but if you like my work and you want to support me, buy me a coffee and also rate my extension ☕<br />
        <ul>
            <li><a href="https://www.paypal.me/Phu1237">Paypal</a></li>
            <li><a href="https://www.buymeacoffee.com/Phu1237">Buymeacoffee</a></li>
            <li><a href="https://me.momo.vn/Phu1237">Momo</a></li>
        </ul>
    </div>
    <b>Thanks for using my extension 🎉</b>
    <br />
    <script>
        const vscode = acquireVsCodeApi(); // VS Code API
        let btn_go_to_settings = document.getElementById('btn-go-to-settings');

        btn_go_to_settings.onclick = function () {
            vscode.postMessage({
                command: 'go-to-settings'
            })
        }
    </script>
</body>

</html>
  `;
  return content;
};