import Data from "../types/data";
const packageJSON = require("../../package.json");

export default (webviewContext: WebviewContext, data: Data) => {
  // Render asset url
  function asset(path: string) {
    return webviewContext.webviewUri + path;
  }
  let extensionVersion = packageJSON.version || "0.0.0";

  let content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --container-padding: 20px;
            --input-padding-vertical: 6px;
            --input-padding-horizontal: 4px;
            --input-margin-vertical: 4px;
            --input-margin-horizontal: 0;
        }

        body {
            margin: 0;
            padding: 0;
            color: var(--vscode-foreground);
            font-size: var(--vscode-font-size);
            font-weight: var(--vscode-font-weight);
            font-family: var(--vscode-font-family);
            background-color: var(--vscode-editor-background);
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: var(--container-padding);
        }

        h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            color: var(--vscode-editor-foreground);
        }

        h1 { font-size: 2em; margin-bottom: 0.5em; }
        h2 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 1em; border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 0.3em; }
        h3 { font-size: 1.2em; margin-top: 1em; margin-bottom: 0.5em; }

        a {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
        }

        a:hover {
            color: var(--vscode-textLink-activeForeground);
            text-decoration: underline;
        }

        ul {
            padding-left: 1.5em;
        }

        li {
            margin-bottom: 0.5em;
        }

        code {
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-textBlockQuote-background);
            padding: 2px 4px;
            border-radius: 3px;
        }

        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 14px;
            font-size: 1em;
            cursor: pointer;
            border-radius: 2px;
        }

        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1em;
        }

        th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        th {
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            font-weight: 600;
        }

        /* Cards/Sections */
        .section {
            margin-bottom: 2em;
        }

        .hero {
            text-align: center;
            padding: 2em 0;
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 6px;
            margin-bottom: 2em;
        }

        .logo {
            max-width: 100px;
            margin-bottom: 10px;
        }

        .version-badge {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 0.8em;
            vertical-align: middle;
        }

        .feature-list li {
            position: relative;
        }

        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
        }

        .alert-info {
            color: var(--vscode-descriptionForeground);
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-color: var(--vscode-panel-border);
        }

        /* Utilities */
        .text-center { text-align: center; }
        .mt-2 { margin-top: 1em; }
        .mb-2 { margin-bottom: 1em; }

        .settings-key {
            font-family: var(--vscode-editor-font-family);
            font-weight: bold;
            color: var(--vscode-textPreformat-foreground);
        }

        .support-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            list-style: none;
            padding: 0;
        }

        .support-links li {
            margin: 0;
        }
    </style>
</head>

<body>
<div class="container">

    <div class="hero">
        <h1>VS Browser <span class="version-badge">v${extensionVersion}</span></h1>
        <p>A simple, powerful browser built right into VS Code.</p>
    </div>

    <div class="section">
        <h2>🎉 What's New</h2>
        <ul class="feature-list">
            <li>
                <strong>New Feature: Open Links in VS Browser</strong>
                <ul>
                    <li>Added <code>vs-browser.link.enabled</code> to enable/disable this feature.</li>
                    <li>Added <code>vs-browser.link.openIn</code> to control where links are detected (Document/Terminal).</li>
                    <li>Added <code>vs-browser.link.openWith</code> to choose the browser mode.</li>
                </ul>
            </li>
            <li><strong>Fix:</strong> Removed <code>zlib</code> dependency to resolve installation failures.</li>
            <li><strong>Fix:</strong> Resolved runtime errors in WebviewViewProvider.</li>
        </ul>
    </div>

    <div class="section">
        <h2>🚀 Getting Started</h2>
        <div class="alert alert-info">
            <strong>Pro Tip:</strong> Extension settings are disabled by default. We recommend configuring them to suit your workflow.
        </div>
        <ul>
            <li>Open Command Palette (<code>Ctrl+Shift+P</code> or <code>Cmd+Shift+P</code>).</li>
            <li>Type and select <strong>VS Browser: Start Browser</strong>.</li>
        </ul>
        <div class="text-center mt-2">
            <img style="max-width: 100%; border-radius: 4px; border: 1px solid var(--vscode-panel-border);" src="${asset(
              "images/start-extension.gif"
            )}" alt="Demo of starting VS Browser" />
        </div>
    </div>

    <div class="section">
        <h2>⚙️ Configuration</h2>
        <table>
            <thead>
                <tr>
                    <th>Setting</th>
                    <th>Description</th>
                    <th>Default</th>
                </tr>
            </thead>
            <tbody>`;
  for (let property in packageJSON.contributes.configuration.properties) {
    let value = packageJSON.contributes.configuration.properties[property];
    let key = property.replace(/vs-browser\./g, "");
    let description = String(value.description) || "";
    let defaultValue = String(value.default) || "";

    content += `<tr>
                    <td><span class="settings-key">${key}</span></td>
                    <td>${description}</td>
                    <td><code>${defaultValue}</code></td>
                </tr>`;
  }
  content += `</tbody>
        </table>
        <div class="text-center mt-2">
            <button id="btn-go-to-settings" title="Open VS Code Settings for VS Browser">
                Open Settings
            </button>
        </div>
    </div>

    <div class="section">
        <h2>🐛 Known Issues</h2>
        <p>We are working hard to squash these bugs:</p>
        <ul>
            <li><strong>Local Proxy Server:</strong> Currently in beta. May not close automatically when panels are closed.</li>
            <li><strong>Forms:</strong> Form submissions requiring page redirects might not work as expected in Proxy mode.</li>
            <li><strong>Dialogs:</strong> Occasional phantom error dialogs. (Workaround: Disable <code>showMessageDialog</code>).</li>
        </ul>
    </div>

    <div class="section text-center">
        <h2>☕ Support Development</h2>
        <p>If you enjoy using VS Browser, please consider supporting its development!</p>
        <ul class="support-links">
            <li><a href="https://www.paypal.me/Phu1237">Paypal</a></li>
            <li><a href="https://www.buymeacoffee.com/Phu1237">Buy me a coffee</a></li>
            <li><a href="https://me.momo.vn/Phu1237">Momo</a></li>
        </ul>
        <p class="mt-2"><strong>Thank you for your support! 🎉</strong></p>
    </div>

</div>

<script>
    const vscode = acquireVsCodeApi();
    document.getElementById('btn-go-to-settings').onclick = () => {
        vscode.postMessage({ type: 'go-to-settings' });
    };
</script>
</body>
</html>
  `;
  return content;
};
