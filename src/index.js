const assert = require("node:assert");
const kleur = require("kleur");
const fixer = require("./fixer.js");

module.exports.GFix = class GFix {
  constructor(client, options) {
    assert(
      client?.constructor?.name === "GClient",
      new SyntaxError(`Expected argument #1 to be GClient`)
    );
    assert(
      typeof options === "object" ?? typeof options === "undefined",
      new SyntaxError(`Expected argument #2 to be undefined or object`)
    );

    options = options ?? {};
    options.log = options.log ?? true;
    options.ephemeral = options.ephemeral ?? "CHANNEL";
    options.thinking = options.thinking ?? `*{CLIENT} is thinking...*`;

    this.client = client;
    this.options = options;

    client.gfixOptions = {};
    Object.defineProperties(client.gfixOptions, options);

    fixer(this);

    if (this.cLog) this.log(`Ready!`);
  }

  makeThinking() {
    return this.options.thinking.replace(
      /\{CLIENT\}/g,
      this.client.user.username
    );
  }

  async ephemeralify(message, options) {
    if (options.ephemeral) {
      if (this.options.ephemeral === "DM")
        return await message.author.send(options);
      else return await message.reply(options);
    } else return await message.reply(options);
  }

  time() {
    let date = new Date();
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
  }

  log(...a) {
    console.log(`${kleur.blue(`[GFix/${this.time()}/LOG]`)} ${a.join(", ")}`);
  }
  error(...a) {
    console.log(`${kleur.red(`[GFix/${this.time()}/ERROR]`)} ${a.join(", ")}`);
  }
  warn(...a) {
    console.log(`${kleur.red(`[GFix/${this.time()}/WARN]`)} ${a.join(", ")}`);
  }

  get cLog() {
    return this.options.log;
  }
};
