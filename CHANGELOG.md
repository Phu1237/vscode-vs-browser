# VS Browser

## CHANGELOG

### [2.2.0]

- Add: Favorite pages function
- Add: Use by View (If you want to use in sidebar you need to move it to the place where you want to)
- Add: Example settings for vs code ([example/.vscode](example/.vscode))
- Add: Develop documentation ([DEVELOP.md](DEVELOP.md))
- Add: Changelog documentation ([CHANGELOG.md](CHANGELOG.md))
- Refactor: Replace Bootstrap icons with Codicons
- Refactor: Code and structure
- Fix: Error dialog is not showing

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

### [2.0.1]

- Fix `proxy mode` not working

### [2.0.0]

- Refactor code for better performance
- Add `Local Proxy server` (Beta) (many bugs)
- Add `Local Proxy server settings`
- Add the `Auto-complete URL` setting
- Change settings name
  - `proxy` => `proxyMode`
  - `reload.enableAutoReload` => `reload.autoReloadEnabled`
  - `reload.time` => `reload.reloadAutoReloadDurationTime`
- Fix the `Start without Proxy` command not working properly
- Fix `Auto reload` not reload the current page
- Fix `Address bar value` not showing the current page URL

### [1.2.1]

- Fix the `Updated changes window` that always shows after opening another workspace

### [1.2.0]

- Fix `proxy` not working
- Add the `Start with Proxy` command
- Add the `Start without Proxy` command
- Add `Updated changes window` when the extension is updated

### [1.1.1]

- Add an option to disable the status bar item

### [1.1.0]

- Add `reload on save` config
- Add status bar item

### [1.0.6]

- Improve UX

### [1.0.5]

- Fix the missing page bottom

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
- Fix the error when the URL don't have HTTP or HTTPS

### [1.0.0]

- First release of VS Browser
