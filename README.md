# VS Browser

Built-in browser for Visual Studio Code

![Start extension](https://github.com/Phu1237/vscode-vs-browser/raw/master/images/start-extension.gif)

## Features

- Browser while using Visual Studio Code
- Auto reload your web page after a limited time
- Using a proxy to load the web page

## Usage

- Open command palette (`Ctrl+Shift+P`) & enter "`VS Browser: Start Browser`"
- You should update extension settings for a better experience

## Extension Settings

See the [Features Contributions] tab or in `Settings > Extensions > VS Browser` for more information

## Donation

Thank you for using my product 🎉

This product is free but if you like my work and you want to support me, buy me a coffee ☕

- [Paypal](https://www.paypal.me/Phu1237)
- [Buymeacoffee](https://www.buymeacoffee.com/Phu1237)
- [Momo](https://me.momo.vn/Phu1237)

## Release Notes

### [2.1.0] BREAKING CHANGES VERSION

- `Add`: Add show update change setting to Show "New version changes" after the updated
- `Refactor`: Refactor source code. Change some setting name so it may not get your old setting
- `Fix`: Not start with old URL after reopening VS Code
- `Fix`: Auto reload after duration time not working correctly

### [2.0.11]

- Local Proxy Server: It's working more correctly now. Please give it a try
- Fix: Localhost website now work even if Proxy Mode is enabled
- Fix: Url on Address bar now correct with current page
- Fix: The state of your old session will be restored after reopening VS Code

### [2.0.8]

- `Local Proxy server`: Add `forceLocation`(Some website redirect the user with some weird status code (eg. 400), so you can bypass the status code and keep redirecting the user to the correct URL)

### [2.0.6]

- Fix `reload.autoReloadEnabled` name (`reload.autoReloadenabled` => `reload.autoReloadEnabled`)
- Fix `location` undefined

### [2.0.3]

- `Local Proxy server`: Update `location` depend on header location not just status code
- `Local Proxy server`: Add `Cookie domain rewrite`

### [2.0.1]

- Fix `proxy mode` not working

### [2.0.0]

- Refactor code for better performance
- Add `Local Proxy server` (Beta) (many bugs)
- Add `Local Proxy server settings`
- Add `Auto-complete URL` setting
- Change settings name
  - `proxy` => `proxyMode`
  - `reload.enableAutoReload` => `reload.autoReloadEnabled`
  - `reload.time` => `reload.reloadAutoReloadDurationTime`
- Fix `Start without Proxy` command not working properly
- Fix `Auto reload` not reload current page
- Fix `Address bar value` not show current page URL

### [1.2.1]

- Fix `Updated changes window` always show after open another workspace

### [1.2.0]

- Fix `proxy` not working
- Add `Start with Proxy` command
- Add `Start without Proxy` command
- Add `Updated changes window` when extension updated

### [1.1.1]

- Add option to disable status bar item

### [1.1.0]

- Add `reload on save` config
- Add status bar item

### [1.0.6]

- Improve UX

### [1.0.5]

- Fix missing the page bottom

### [1.0.4]

- Enable `find` in browser
- Add `inspect`
- Refactor source code

### [1.0.3]

- Add instructions
- Add column settings to show in
- Restore to the previous page when re-open VS Code
- Add the title for the button for easier use
- Disable all settings by default
- Fix button hover color
- Fix error when URL don't have HTTP or HTTPS

### [1.0.0]

- First release of VS Browser

## Known Issues

- Sometimes, the dialog still displays even if nothing goes wrong
- Local proxy server won't stop even if all browsers are closed
- Local Proxy server</b> does not support form submit (Pure/HTML form submit) yet

**Enjoy!**
