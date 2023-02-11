import { GuildMember, User } from "discord.js";

/**
 * Converts a {@link User} to a raw API object
 * @param {User} user The user
 */
export function User(user: User): object;
/**
 * Converts a {@link GuildMember} to a raw API object
 * @param {GuildMember} member The user
 */
export function GuildMember(member: GuildMember): object;
