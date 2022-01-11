# VS Browser README

Built-in browser for Visual Studio Code

## Features

- Browser while using Visual Studio Code
- Auto reload your web page after a limited time
- Using a proxy to load the web page

## Usage

- Open command palette (Ctrl+Shift+P) & enter "VS Browser: Start Browser"
- Update extension settings for a better experience

## Extension Settings

This extension contributes the following settings:

* `vs-browser.proxy`: Use proxy to prevent some errors (Longer loading time and can not use with localhost)
* `vs-browser.showMessageDialog`: Show message dialog
* `vs-browser.url`: Default URL open when start the browser
* `vs-browser.reload.enableAutoReload`: Auto reload the browser after a limited time
* `vs-browser.reload.time`: The limited time in milliseconds

## Known Issues

* Sometimes, the dialog still displays even if nothing goes wrong
* Auto reload not reload to the current page (reload to the current address now)

## Release Notes

### [1.0.2] - 2022-01-11

- Restore back to the previous page when reopen VS Code
- Add title to button for easier use

### [1.0.1] - 2022-01-11

- Add instructions
- Disable all settings by default
- Fix button hover color
- Fix error when URL don't have HTTP or HTTPS

### [1.0.0] - 2022-01-10

First release of VS Browser

**Enjoy!**
