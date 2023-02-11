const { CommandContext } = require("gcommands");

module.exports.Context = class Context extends CommandContext {
  constructor(gfix, interaction) {
    super(gfix.client, {
      interaction,
      message: interaction.message,
      command: interaction.command,
      arguments: null, // gets assigned later
      deferReply: interaction.deferReply,
      deleteReply: interaction.deleteReply,
      editReply: interaction.editReply,
      fetchReply: interaction.fetchReply,
      followUp: interaction.followUp,
      reply: interaction.reply,

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
