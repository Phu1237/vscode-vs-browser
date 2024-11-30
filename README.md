# VS Browser

Built-in browser for Visual Studio Code

![Start extension](https://github.com/Phu1237/vscode-vs-browser/raw/master/images/start-extension.gif)

## Features

- Browser while using Visual Studio Code
- Auto reload your web page after a limited time
- Using a proxy to load the web page

## Usage

- Open the command palette (`Ctrl+Shift+P`) & enter "`VS Browser: Start Browser`"
- You should update extension settings for a better experience

## Extension Settings

See the [Features Contributions] tab or in `Settings > Extensions > VS Browser` for more information

## Donation

Thank you for using my product 🎉

This product is free but if you like my work and you want to support me, buy me a coffee ☕

- [Paypal](https://www.paypal.me/Phu1237)
- [Buymeacoffee](https://www.buymeacoffee.com/Phu1237)
- [Momo](https://me.momo.vn/Phu1237)

## Changelog for the Latest 5 Versions

### See the list of changes [here](CHANGELOG.md)

### [2.1.0] BREAKING CHANGES VERSION

- `Add`: Add show update change setting to Show "New version changes" after the updated
- `Refactor`: Refactor source code. Change some setting names so it may not get your old setting
- `Fix`: Not start with old URL after reopening VS Code
- `Fix`: Auto reload after duration time not working correctly

### [2.0.11]

- Local Proxy Server: It's working more correctly now. Please give it a try
- Fix: Localhost website now works even if Proxy Mode is enabled
- Fix: Url on the Address bar now correct with the current page
- Fix: The state of your old session will be restored after reopening VS Code

### [2.0.8]

- `Local Proxy server`: Add `forceLocation`(Some websites redirect the user with some weird status code (eg. 400), so you can bypass the status code and keep redirecting the user to the correct URL)

### [2.0.6]

- Fix the `reload.autoReloadEnabled` name (`reload.autoReloadenabled` => `reload.autoReloadEnabled`)
- Fix `location` undefined

### [2.0.3]

- `Local Proxy server`: Update `location` depends on header location not just status code
- `Local Proxy server`: Add `Cookie domain rewrite`

## Known Issues

- Sometimes, the dialog still displays even if nothing goes wrong
- Local proxy server won't stop even if all browsers are closed
- Local Proxy server</b> does not support form submit (Pure/HTML form submit) yet

**Enjoy!**
