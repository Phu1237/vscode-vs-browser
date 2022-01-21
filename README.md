# VS Browser README

Built-in browser for Visual Studio Code

## Features

- Browser while using Visual Studio Code
- Auto reload your web page after a limited time
- Using a proxy to load the web page

## Usage

- Open command palette (`Ctrl+Shift+P`) & enter "`VS Browser: Start Browser`"
- All extension settings are `disable by default`, you should update extension settings for a better experience

## Extension Settings

This extension contributes the following settings:

* `vs-browser.proxy`: Use proxy to prevent some errors (Longer loading time and can not use with localhost)
* `vs-browser.showMessageDialog`: Show message dialog
* `vs-browser.url`: Default URL open when start the browser
* `vs-browser.reload.enableAutoReload`: Auto reload the browser after a limited time
* `vs-browser.reload.time`: The limited time in milliseconds

## Known Issues

* Sometimes, the dialog still displays even if nothing goes wrong
* Auto reload not reload to the current page (reload to the URL on URL input now)

## Release Notes

### [1.0.6] - 2022-01-21

- Improve UX

### [1.0.5] - 2022-01-21

- Fix missing the page bottom

### [1.0.4] - 2022-01-15

- Enable find in browser
- Add inspect
- Refactor source code

### [1.0.3] - 2022-01-11

- Add instructions
- Add column settings to show in
- Restore to the previous page when re-open VS Code
- Add the title for the button for easier use
- Disable all settings by default
- Fix button hover color
- Fix error when URL don't have HTTP or HTTPS

### [1.0.0] - 2022-01-10

- First release of VS Browser

**Enjoy!**
