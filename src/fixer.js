const {
  Listener,
  Commands,
  CommandType,
  CommandContext,
} = require("gcommands");
const { Interaction, Context } = require("./classes");

module.exports = (that) => {
  that.client.listeners.register(
    new Listener({
      name: "gfix-messageCommands",
      event: "messageCreate",
      run: async (message) => {
        if (
          !message.content
            .toLowerCase()
            .startsWith(that.client.messagePrefix.toLowerCase())
        )
          return;

        let [cmd, ...argument] = message.content
          .slice(that.client.messagePrefix.length)
          .split(/ +/g);

        let command;
        for (let x of [...Commands.values()]) {
          if (cmd.toLowerCase() === x.name.toLowerCase()) command = x;
        }

        if (!command) return;

        if (!command.type.includes(CommandType.MESSAGE)) return;
        if (!command.dmPermission && !message.guild && !message.guildId) return;
        if (
          command.defaultMemberPermissions &&
          (!message.guild ||
            (message.member &&
              !message.member.permissions.has(defaultMemberPermissions)))
        )
          return;

        let interaction = new Interaction(that.gfix, message, command);
        let ctx = new Context(that.gfix, interaction);

        // TODO: finish this!!
      },
    })
  );
};
