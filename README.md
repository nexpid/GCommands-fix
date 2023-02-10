# GCommands-fix

A [@Garlic-Team/GCommands](https://github.com/Garlic-Team/GCommands) Message Command fix.

# Installation

```
npm i github:Gabe616/GCommands-fix --save
```

# Usage

```js
require("dotenv").config();
const { GClient } = require("gcommands");
const { GFix } = require("gcommands-fix");

const client = new GClient({
  dirs: [__dirname + "/src/commands"],
  messageSupport: false, // REQUIRED!
  messagePrefix: "?",
  intents: [],
});
GFix(client);

client.login(process.env.token);
```
