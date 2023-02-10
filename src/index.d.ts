import { GClient } from "gcommands";

/** The GFix class. */
export class GFix {
  /**
   * The GFix constructor.
   * @param client The GClient class
   * @param options The GFixOptions
   */
  constructor(client: GClient, options?: GFixOptions);

  /** The GClient class */
  client: GClient;

  /** The GFixOptions */
  options: GClient;
}

export enum GFixEphemeralBehaviour {
  SendInChannel = "CHANNEL",
  SendInDM = "DM",
}

export interface GFixOptions {
  /** Whether GFix should log to the console */
  log: boolean;
  /** The behaviour of ephemeral messages */
  ephemeral: GFixEphemeralBehaviour;
  /** The message that shows up when a response gets deferred */
  thinking: string;
  /** An object with responses (check responses.js!) */
  responses: object;
}
