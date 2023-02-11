const {
  CommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
} = require("discord.js");
const { SnowflakeUtil } = require("discord.js/src/index.js");
const crypto = require("node:crypto");
const { User, GuildMember } = require("../APIify.js");

module.exports.Interaction = class Interaction extends CommandInteraction {
  constructor(gfix, message, gcommand) {
    super(gfix.client, {
      id: message.id,
      application_id: gfix.client.application.id,
      type: 2,
      data: {
        id: SnowflakeUtil.generate({ timestamp: Date.now() }),
        name: gcommand.name,
        type: 2,
        guild_id: gfix.client.devGuildId,
      },
      guild_id: message.guild?.id,
      channel_id: message.channel.id,
      member: message.member ? GuildMember(message.member) : undefined,
      user: User(message.author),
      token: crypto.randomBytes(20).toString("hex"),
      version: 1,
      app_permissions: message.guild.members.me.permissions.bitfield.toString(),
      locale: "en-US",
      guild_locale: message.guild?.preferredLocale,
    });

    this.gcommand = gcommand;
    this.message = message;
    this.gfix = gfix;

    delete this.webhook;
  }

  get command() {
    return this.gcommand;
  }

  transformResolved() {
    throw new SyntaxError(
      "cannot use CommandInteraction#transformResolved in GFix messages"
    );
  }
  transformOption() {
    throw new SyntaxError(
      "cannot use CommandInteraction#transformOption in GFix messages"
    );
  }
  showModal() {
    throw new SyntaxError(
      "cannot use InteractionResponses#showModal in GFix messages"
    );
  }
  awaitModalSubmit() {
    throw new SyntaxError(
      "cannot use InteractionResponses#awaitModalSubmit in GFix messages"
    );
  }

  async deferReply(options = {}) {
    if (this.deferred || this.replied)
      throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);

    this.ephemeral = options.ephemeral ?? false;
    let reply = await this.interaction.gfix.ephemeralify(this.message, {
      content: this.interaction.gfix.makeThinking(),
    });
    this.msg = reply;
    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : {};
  }

  async reply(options) {
    if (this.deferred || this.replied)
      throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);
    this.ephemeral = options.ephemeral ?? false;

    let reply = await this.interaction.gfix.ephemeralify(this.message, options);
    this.msg = reply;
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : {};
  }

  async editReply(options) {
    if (!this.deferred && !this.replied)
      throw new DiscordjsError(DiscordjsErrorCodes.InteractionNotReplied);
    const msg = await this.msg.edit(options);

    this.replied = true;
    return msg;
  }

  async deleteReply() {
    await this.msg.delete();
  }

  fetchReply() {
    return this.msg;
  }

  async followUp(options) {
    if (!this.deferred && !this.replied)
      throw new DiscordjsError(DiscordjsErrorCodes.InteractionNotReplied);
    return await this.msg.reply(options);
  }
};
