export interface Responses {
  /**
   * Used when an invalid subcommand/subcommand group is provided
   * @param {{ pos: number, options: string[] }} data The data
   * @returns {void}
   */
  INVALID_SUBCOMMAND: function;
  /**
   * Used when a required argument is missing
   * @param {{ pos: number, name: string }} data The data
   * @returns {void}
   */
  MISSING_ARG: function;
  /**
   * Used when a required argument is invalid
   * @param {{ pos: number, name: string }} data The data
   * @returns {void}
   */
  INVALID_ARG: function;
}
