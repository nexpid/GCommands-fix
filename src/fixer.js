const { CommandInteractionOptionResolver } = require("discord.js");
const {
  Listener,
  Commands,
  CommandType,
  ArgumentType,
  Logger,
  Events,
  ListenerManager,
} = require("gcommands");
const GUtil = require("gcommands/dist/lib/util/Util").Util;
const base =
  require("gcommands/dist/lib/structures/arguments/base").MessageArgumentTypeBase;
const { Interaction, Context } = require("./classes");

module.exports = (that) => {
  new ListenerManager().register(
    new Listener({
      name: "gfix-messageCommands",
      event: "messageCreate",
      run: async (message) => {
        if (
          !message.content
            .toLowerCase()
            .startsWith(that.options.prefix.toLowerCase())
        )
          return;

        let [cmd, ...farguments] = message.content
          .slice(that.options.prefix.length)
          .split(/ +/g);

        let command;
        for (let x of [...Commands.values()]) {
          if (cmd.toLowerCase() === x.name.toLowerCase()) command = x;
        }

        if (!command) return;

        if (!command.type.includes(CommandType.MESSAGE)) return;
        if (!command.dmPermission && !message.guild && !message.guildId) return;
        if (command.defaultMemberPermissions && !message.guild) return;

        if (
          command.defaultMemberPermissions &&
          !message.member.permissions.has(command.defaultMemberPermissions)
        )
          return;

        /*        let member = message.guild
                  ? await message.guild.members.fetch(message.author.id)
                  : null;*/
        let member = null;
        let interaction = new Interaction(that, message, command, member);
        let ctx = new Context(that, interaction);

        /*        let inh = await command.inhibit(ctx);
        if (!inh) return;*/

        let argz = [];
        let writeTo = argz;

        let argRoot = command.arguments ?? [];
        let fargs = farguments.slice();
        let offset = 0;

        let hasSCGroup = !!argRoot.find(
          (x) => x.type == ArgumentType.SUB_COMMAND_GROUP
        );
        if (hasSCGroup) {
          let validSCgroup = argRoot.find(
            (x) => x.name.toLowerCase() === (fargs[0] || "").toLowerCase()
          );
          if (!validSCgroup)
            return message.reply({
              content: that.getResponse(
                that.options.responses.INVALID_SUBCOMMAND,
                {
                  pos: offset + 1,
                  options: argRoot.map((x) => x.name),
                }
              ),
            });

          offset++;
          argRoot = validSCgroup.arguments;
          fargs = fargs.slice(1);

          let obj = {
            name: validSCgroup.name,
            description: validSCgroup.description,
            type: validSCgroup.type,
            options: [],
          };
          argz.push(obj);
          writeTo = obj.options;
        }

        let hasSC = !!argRoot.find((x) => x.type == ArgumentType.SUB_COMMAND);
        if (hasSC) {
          let validSC = argRoot.find(
            (x) => x.name.toLowerCase() === (fargs[0] || "").toLowerCase()
          );
          if (!validSC)
            return message.reply({
              content: that.getResponse(
                that.options.responses.INVALID_SUBCOMMAND,
                {
                  pos: offset + 1,
                  options: argRoot.map((x) => x.name),
                }
              ),
            });

          offset++;
          argRoot = validSC.arguments;
          fargs = fargs.slice(1);

          let obj = {
            name: validSC.name,
            description: validSC.description,
            type: validSC.type,
            options: [],
          };
          argz.push(obj);
          writeTo = obj.options;
        }

        let i = -1;
        for (let aa of argRoot) {
          i++;
          let frg = fargs[i];
          if (!aa.required && !frg) continue;

          let Arg = await base.createArgument(aa.type, message.guild);

          if (!frg)
            return message.reply({
              content: that.getResponse(that.options.responses.MISSING_ARG, {
                pos: offset + i,
                name: aa.name,
              }),
            });
          if (!Arg.validate(frg))
            return message.reply({
              content: that.getResponse(that.options.responses.INVALID_ARG, {
                pos: offset + i,
                name: aa.name,
              }),
            });

          let rg = Arg.resolve(aa);
          rg.type = ArgumentType[rg.type] || rg.type;

          if (rg.type == ArgumentType.INTEGER)
            rg.value = Math.floor(Number(rg.value));
          else if (rg.type == ArgumentType.NUMBER) rg.value = Number(rg.value);

          writeTo.push(rg);
        }

        let arguments = new CommandInteractionOptionResolver(
          message.client,
          argz,
          {}
        );
        ctx.arguments = arguments;

        await Promise.resolve(command.run(ctx))
          .catch(async (error) => {
            Logger.emit(Events.HANDLER_ERROR, ctx, error);
            Logger.emit(Events.COMMAND_HANDLER_ERROR, ctx, error);
            Logger.error(
              typeof error.code !== "undefined" ? error.code : "",
              error.message
            );
            if (error.stack) Logger.trace(error.stack);
            const errorReply = async () =>
              ctx.safeReply({
                content: await GUtil.getResponse("ERROR", { client }),
                components: [],
              });
            if (typeof command.onError === "function") {
              await Promise.resolve(command.onError(ctx, error)).catch(
                async () => await errorReply()
              );
            } else {
              await errorReply();
            }
          })
          .then(() => {
            Logger.emit(Events.HANDLER_RUN, ctx);
            Logger.emit(Events.COMMAND_HANDLER_RUN, ctx);
            Logger.debug(
              `Successfully ran message command (${command.name}) for ${message.author.username}`
            );
          });
      },
    })
  );
};
