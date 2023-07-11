# StagNation
## The Obsidian Plugin for managing your classes at universities using the STAG information system

So far the plugin only provides authentication functionality.
All class management features are still in development (see roadmap below).

Currently the plan is to have the plugin use information from STAG in a way that is compatible 
with using other plugins for the actual management part. Namely the
[Projects plugin](https://github.com/marcusolsson/obsidian-projects)
and the 
[Spaced repetition plugin](https://github.com/st3v3nmw/obsidian-spaced-repetition)
.

## Roadmap

### Next Up
 - Importing classes as notes with appropriate yaml headers
 - Customizing yaml header fields

# Development

- [**WebServices API Documentation for UPOL**](https://stag-ws.upol.cz/ws/web?pp_locale=en&selectedTyp=REST&pp_reqType=render&pp_page=serviceList)

- [**STAG API documentation authentication section**](https://is-stag.zcu.cz/napoveda/web-services/ws_prihlasovani.html)

- [**Ikony které Obsidian používá**](https://lucide.dev/)

This sample plugin demonstrates some of the basic functionality the plugin API can do.
- Changes the default font color to red using `styles.css`.
- Adds a ribbon icon, which shows a Notice when clicked.
- Adds a command "Open Sample Modal" which opens a Modal.
- Adds a plugin setting tab to the settings page.
- Registers a global click event and output 'click' to the console.
- Registers a global interval which logs 'setInterval' to the console.


## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

## Adding your plugin to the community plugin list

- Check https://github.com/obsidianmd/obsidian-releases/blob/master/plugin-review.md
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## How to use

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## API Documentation

See https://github.com/obsidianmd/obsidian-api
- [**Obsidian API (obsidian.d.ts)**](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)
**Note:** The Obsidian API is still in early alpha and is subject to change at any time!
