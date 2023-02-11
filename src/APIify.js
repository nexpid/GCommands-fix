module.exports.User = function (user) {
  return {
    id: user.id,
    username: user.username,
    discriminator: user.discriminator,
    avatar: user.avatar,
    bot: user.bot,
    system: user.system,
    banner: user.banner,
    accent_color: user.accentColor,
    flags: user.flags?.bitfield,
    public_flags: user.flags?.bitfield,
  };
};
module.exports.GuildMember = function (member) {
  let user = exports.User(member.user);
  return {
    user,
    nick: member.nickname,
    avatar: member.avatar,
    roles: member._roles ?? [],
    joined_at: member.joinedTimestamp?.toISOString(),
    premium_since: member.premiumSinceTimestamp?.toISOString(),
    deaf: member.voice.deaf,
    mute: member.voice.mute,
    flags: user.flags,
    pending: member.pending,
    permissions: member.permissions.bitfield,
    communication_disabled_until:
      member.communicationDisabledUntilTimestamp?.toISOString(),
  };
};
