const { CommandContext } = require("gcommands");

module.exports.Context = class Context extends CommandContext {
  constructor(gfix, interaction) {
    let obj = {};
    for (let x of Object.getOwnPropertyNames(
      Object.getPrototypeOf(interaction)
    )) {
      let y = interaction[x];
      if (x !== "constructor" && typeof y === "function")
        obj[x] = y.bind(interaction);
    }

    super(gfix.client, {
      interaction,
      message: interaction.message,
      command: interaction.command,
      arguments: null, // gets assigned later
      ...obj,

      channel: interaction.message.channel,
      channelId: interaction.message.channel.id,
      createdAt: interaction.message.createdAt,
      createdTimestamp: interaction.message.createdTimestamp,
      guild: interaction.message.guild,
      guildId: interaction.message.guild.id,
      member: interaction.member,
      user: interaction.message.author,
      userId: interaction.message.author.id,
      memberPermissions: interaction.gcommand.defaultMemberPermissions,
    });
  }
};
