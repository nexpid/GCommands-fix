const assert = require("node:assert");
const fixer = require("./fixer.js");
const responses = require("./responses.js");
const { Logger } = require("gcommands");

module.exports.GFix = class GFix {
  constructor(client, options) {
    assert(
      client?.constructor?.name === "GClient",
      `expected argument #1 to be GClient`
    );
    assert(
      typeof options === "object" || typeof options === "undefined",
      `expected argument #2 to be undefined or object`
    );

    options = options ?? {};
    options.log = options.log ?? true;
    options.ephemeral = options.ephemeral ?? "CHANNEL";
    options.thinking = options.thinking ?? `*{CLIENT} is thinking...*`;
    options.responses = options.responses ?? responses;

    this.options = options;

    client.gfixOptions = {};
    Object.defineProperties(client.gfixOptions, options);

    fixer(this);

    if (this.cLog) Logger.info(`GFix Ready!`);
  }

  makeThinking() {
    return this.options.thinking.replace(
      /\{CLIENT\}/g,
      this.client.user.username
    );
  }

  getResponse(thi, obj) {
    let rp;
    try {
      rp = thi(obj);
    } catch {
      return `Failed to get response!`;
    }

    return rp.toString();
  }

  deepArgSearch(args, filter) {
    let perform = (x) => {
      for (let y of x) {
        if (filter(y)) return y;
        else if (y.arguments) return perform(y.arguments);
      }
      return;
    };

    return perform(args);
  }

  async ephemeralify(message, options) {
    if (options.ephemeral) {
      if (this.options.ephemeral === "DM")
        return await message.author.send(options);
      else return await message.reply(options);
    } else return await message.reply(options);
  }

  get cLog() {
    return this.options.log;
  }
};
