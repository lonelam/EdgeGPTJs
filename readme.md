# EdgeGPTJs
English | [简体中文](./README.zh-CN.md)
[![npm version](https://img.shields.io/npm/v/edgegptjs)](https://www.npmjs.com/package/edgegptjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

<!-- [![Build Status](https://img.shields.io/github/workflow/status/lonelam/EdgeGPTJs/CI)](https://github.com/lonelam/EdgeGPTJs/actions) -->
<!-- [![Code Coverage](https://img.shields.io/codecov/c/github/lonelam/EdgeGPTJs)](https://codecov.io/gh/lonelam/EdgeGPTJs) -->

<img src="docs/edgegptjs.png" alt="EdgeGPTJs Logo" width="200" height="200"/>

Welcome to EdgeGPTJs, a Node.js package inspired by the Python version [EdgeGPT](https://github.com/acheong08/EdgeGPT) repository. This package allows you to reverse engineer the chat feature of the new version of Bing, making it easier than ever to leverage the power of Bing's chat capabilities within your own projects.

## Table of Contents

- [EdgeGPTJs](#edgegptjs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Roadmap](#roadmap)
  - [Requirements](#requirements)
    - [Checking access (Required)](#checking-access-required)
    - [Getting authentication (Required)](#getting-authentication-required)
  - [Prompt Tool Usage](#prompt-tool-usage)
  - [Library Usage](#library-usage)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Reverse engineer the chat feature of the new version of Bing
- Easy-to-use API with thorough documentation
- Highly customizable and extendable

## Roadmap
- [x] CLI tools by demo
- [x] exportable api by npm package
- [ ] one-click remote deployment inspired by [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
- [ ] integrate it with [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)

## Requirements
- A Microsoft Account with early access to https://bing.com/chat (Required)
- Required in a supported country with New Bing (Chinese mainland VPN required)

### Checking access (Required)
<summary>
  <details>
- Install the latest version of Microsoft Edge
- Alternatively, you can use any browser and set the user-agent to look like you're using Edge (e.g., `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.51`). You can do this easily with an extension like "User-Agent Switcher and Manager" for [Chrome](https://chrome.google.com/webstore/detail/user-agent-switcher-and-m/bhchdcejhohfmigjafbampogmaanbfkg) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/).
- Open [bing.com/chat](https://bing.com/chat)
- If you see a chat feature, you are good to go
  </details>
</summary>

### Getting authentication (Required)

<summary>
  <details>

- Install the cookie editor extension for [Chrome](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)
- Go to `bing.com`
- Open the extension
- Click "Export" on the bottom right, then "Export as JSON" (This saves your cookies to clipboard)
- Paste your cookies into a file `cookies.json`

  </details>
</summary>

## Prompt Tool Usage
use ENVIRONMENT_VARIABLE to pass cookie jar file.
```
export COOKIE_FILE=/path/to/cookie.json
npx edgegptjs
```
or use 
```bash
npx edgegptjs --cookie-file=cookie.json
```

## Library Usage

To get started with EdgeGPTJs, import the package and create a new instance of `Chatbot`:

```javascript
const { Chatbot } = require('edgegptjs');
const bot = new Chatbot(args.cookiePath);
await bot.chatHubInitialization;
const response = await bot.ask("What's the result of 1+1?");
console.log(`Bot: ${response}`);
```

For a detailed explanation of the API and available methods, please refer to the [documentation](https://github.com/lonelam/EdgeGPTJs/wiki).

## Contributing

![All Contributors](https://img.shields.io/github/contributors/lonelam/EdgeGPTJs)

We welcome contributions from the community. If you'd like to contribute to EdgeGPTJs, please read our [contributing guidelines](https://github.com/lonelam/EdgeGPTJs/blob/main/CONTRIBUTING.md) to get started.

## License

EdgeGPTJs is released under the [MIT License](https://github.com/lonelam/EdgeGPTJs/blob/main/LICENSE).

![Star History](https://starchart.cc/lonelam/EdgeGPTJs.svg)

