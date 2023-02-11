# GCommands-fix

A [gcommands](https://www.npmjs.com/package/gcommands) Message Command fix.

# Installation

```
npm i gcommands-fix --save
```

# Usage

```js
require("dotenv").config();
const { GClient } = require("gcommands");
const { GFix, GFixEphemeralBehaviour } = require("gcommands-fix");

const client = new GClient({
  dirs: [__dirname + "/src/commands"],
  messageSupport: false, // MUST be disabled!
  intents: [],
});
new GFix(client, {
  prefix: "!",
  log: true,
  ephemeral: GFixEphemeralBehaviour.SendInChannel,
  thinking: `*{CLIENT} is thinking...*`,
});

client.login(process.env.token);
```
