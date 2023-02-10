module.exports = {
  INVALID_SUBCOMMAND: ({ pos, options }) =>
    `❌ Invalid argument at position #${pos}! Choices: ${options}`,
  MISSING_ARG: ({ pos, name }) => `❌ Missing required argument at position #${pos} (${name})!`,
  INVALID_ARG: ({ pos, name }) => `❌ Invalid argument at position #${pos} (${name})!`,
};
