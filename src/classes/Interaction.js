const {
  CommandInteraction,
  DiscordjsError,
  DiscordjsErrorCodes,
  MessagePayload,
} = require("discord.js");

module.exports.Interaction = class Interaction extends CommandInteraction {
  constructor(gfix, message, gcommand, member) {
    super(gfix.client, {
      type: 2,
      id: message.id,
      token: null,
      application_id: gfix.client?.application?.id,
      channel_id: message.channel?.id ?? null,
      guild_id: message.guild?.id ?? null,
      user: message.author,
      member: member,
      version: 0,
      app_permissions: null,
      locale: message.guild.preferredLocale,
      guild_locale: message.guild.preferredLocale,

      data: {
        id: message.id,
        name: gcommand.name,
        type: 3,
        guild_id: message.guild?.id ?? null,
      },
    });

    this.gcommand = gcommand;
    this.message = message;
    this.gfix = gfix;

    this._reply = null;

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
    let reply = await this.gfix.ephemeralify(this.message, {
      content: this.gfix.makeThinking(),
    });
    this._reply = reply;
    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : {};
  }

  async reply(options) {
    if (this.deferred || this.replied)
      throw new DiscordjsError(DiscordjsErrorCodes.InteractionAlreadyReplied);
    this.ephemeral = options.ephemeral ?? false;

    let messagePayload;
    if (options instanceof MessagePayload) messagePayload = options;
    else messagePayload = MessagePayload.create(this, options);

    const { body: data, files } = await messagePayload
      .resolveBody()
      .resolveFiles();

    let reply = await this.gfix.ephemeralify(this.message, {
      ...data,
      files,
    });
    this._reply = reply;
    this.replied = true;

    return options.fetchReply ? this.fetchReply() : {};
  }

  get fetchReply() {
    return this._reply;
  }

  async editReply(options) {
    if (!this.deferred && !this.replied)
      throw new DiscordjsError(ErrorCodes.InteractionNotReplied);
    const msg = await this._reply.edit(options);

    this.replied = true;
    return msg;
  }

  async deleteReply() {
    await this._reply.delete();
  }

  async followUp(options) {
    if (!this.deferred && !this.replied)
      throw new DiscordjsError(ErrorCodes.InteractionNotReplied);
    return await this.message.reply(options);
  }
};
