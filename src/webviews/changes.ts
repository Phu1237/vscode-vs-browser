import Data from '../types/data';

export default (webviewUri: string, data: Data) => {
  // Render asset url
  function asset(path: string) {
    return webviewUri + path;
  }
  let extensionVersion = data['version'] || '0.0.0';

  return `
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
    th, tr:not(:last-child) > td {
      border-bottom: 1px solid;
    }
    th:not(:last-child), td:not(:last-child) {
      border-right: 1px solid;
    }
    </style>
  </head>
  <body>
  <div>
  <h1>Changes (version ${extensionVersion})</h1>
  <ul>
    <li>Add <b>Local Proxy server (beta)</b></li>
    <li>Add <b>Local Proxy server settings</b></li>
    <li>Add <b>Auto-complete URL</b> setting</li>
    <li>Fix <b>Start without Proxy</b> command not working properly</li>
    <li>Fix <b>Auto reload</b> not reload current page</li>
    <li>Fix <b>Address bar value</b> not show current page URL</li>
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
    <br/>
    <table>
      <thead>
        <th>Setting</th>
        <th>Description</th>
        <th>Default</th>
      </thead>
      <tbody>
      <tr>
        <td>proxy</td>
        <td style="text-align: left">Use proxy to prevent the some errors (Longer loading time and can not use with localhost)</td>
        <td>false</td>
      </tr>
      <tr>
        <td>url</td>
        <td style="text-align: left">Default URL open when starting the browser</td>
        <td>http://localhost</td>
      </tr>
      <tr>
        <td>autoCompleteUrl</td>
        <td style="text-align: left">Auto-complete URL when your URL is not an absolute URL</td>
        <td>http://</td>
      </tr>
      <tr>
      <td>localProxyServer.enabled</td>
      <td style="text-align: left">Enable/Disable Local proxy server</td>
      <td>false</td>
      </tr>
      <tr>
      <td>localProxyServer.port</td>
      <td style="text-align: left">Local proxy server port</td>
      <td>9999</td>
      </tr>
      <tr>
      <td>reload.onSave</td>
      <td style="text-align: left">Auto reload the browser when file is saved</td>
      <td>false</td>
      </tr>
      <tr>
      <td>reload.autoReloadEnabled</td>
      <td style="text-align: left">Enable/Disable Auto reload the browser after a limited time</td>
      <td>false</td>
      </tr>
      <tr>
      <td>reload.durationTime</td>
      <td style="text-align: left">The limited time in milliseconds</td>
      <td>15000</td>
      </tr>
      <tr>
      <td>columnToShowIn</td>
      <td style="text-align: left">Default column to show in</td>
      <td>Two</td>
      </tr>
      <tr>
      <td>showMessageDialog</td>
      <td style="text-align: left">Show message dialog (sometimes the dialog still displays even if nothing goes wrong)</td>
      <td>false</td>
      </tr>
      <tr>
      <td>showStatusBarItem</td>
      <td style="text-align: left">Show status bar item</td>
      <td>true</td>
      </tr>
      </tbody>
    </table>
    <div style="margin-top: 10px;">
    <button id="go-to-settings">
      Open Settings
    </button>
    </div>
  </div>
</div>
<div>
  <h2>*Bugs: </h2>
  <ul>
    <li>
      <b>Local Proxy server</b> will not be automatically closed when you closed all the panel</b>
    </li>
    <li>
      <b>Local Proxy server</b> does not support form submit (Pure/HTML form submit) yet<br/>
      <i>Notes:</i>
      <ul>
        <li>JS form submit still working</li>
      </ul>
    </li>
    <li>
      Sometimes, the dialog still displays even if nothing goes wrong<br/>
      <i>Solves:</i>
      <ul>
        <li>Turn of <b>showMessageDialogg</b> setting</li>
        <li><b>Using Local Proxy Server</b></li>
      </ul>
    </li>
  </ul>
  I will fix these bugs as soon as possible.
</div>
<div>
  <h3>Donation</h3>
  This product is free but if you like my work and you want to support me, buy me a coffee and also rate my extension ☕<br/>
  <ul>
    <li><a href="https://www.paypal.me/Phu1237">Paypal</a></li>
    <li><a href="https://www.buymeacoffee.com/Phu1237">Buymeacoffee</a></li>
    <li><a href="https://me.momo.vn/Phu1237">Momo</a></li>
  </ul>
</div>
<b>Thanks for using my extension 🎉</b>

    <script>
      const vscode = acquireVsCodeApi(); // VS Code API
      let btn_reload = document.getElementById('btn-reload');
      let btn_settings = document.getElementById('btn-settings');

      btn_settings.onclick = function () {
        vscode.postMessage({
          command: 'go-to-settings'
        })
      }
    </script>
  </body>

  </html>
  `;
};