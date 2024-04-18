const { EmbedBuilder } = require("discord.js");
const { expToLevels } = require("../../utils/levels");
const { getUserExp, getAllUsers } = require("../../utils/db/levels");
const { getAuditLogForUser } = require("../../utils/db/audit");
const { colors } = require("../../utils/entities");
const { COMMAND_OPTIONS } = require("../../enums");

const filterUsersByGuild = async function (users, guildId) {
  const promises = users.map(async (x) => {
    return client.guilds.cache
      .get(guildId)
      .members.fetch(x.id)
      .then((m) => m)
      .catch(() => null);
  });

  return Promise.all(promises);
};

const getLbPosition = async function (user, guildId) {
  const entries = getAllUsers();
  const sorted = entries.sort((a, b) => b.xp - a.xp);
  const guildUsers = (await filterUsersByGuild(sorted, guildId)).filter(
    (x) => x !== null,
  );

  const userIndex = guildUsers.findIndex((x) => x.id === user.id);
  const globalIndex = sorted.findIndex((x) => x.id === user.id);

  return {
    guild: userIndex + 1,
    global: globalIndex + 1,
  };
};

module.exports = {
  name: "profile",
  description: "View your profile!",
  ephemeral: false,
  showHelp: true,
  options: [
    {
      name: "user",
      description: "The user to view the profile of.",
      type: COMMAND_OPTIONS.USER,
      required: false,
    },
  ],
  async execute({ inter }) {
    const user = inter.options.getUser("user") || inter.user;

    const exp = getUserExp(user.id);
    const level = expToLevels(exp.xp);

    const auditLogs = getAuditLogForUser(user.id);
    const modActionsTaken = auditLogs.length;

    const mutes = auditLogs.filter((x) => x.action === "mute").length;
    const kicks = auditLogs.filter((x) => x.action === "kick").length;
    const bans = auditLogs.filter((x) => x.action === "ban").length;

    let { guild, global } = await getLbPosition(user, inter.guild.id);
    if (guild < 0) guild = "N/A";
    if (global < 0) global = "N/A";

    const embed = new EmbedBuilder()
      .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setTitle(`${user.username}'s Profile`)
      .setColor(colors.default)
      .addFields(
        {
          name: "Level",
          value: `${level}`,
          inline: true,
        },
        {
          name: "XP",
          value: `${exp.xp}`,
          inline: true,
        },
        {
          name: "Leaderboard Position",
          value: `Guild: ${guild}\nGlobal: ${global}`,
          inline: true,
        },
        {
          name: `Mod Actions [${modActionsTaken}]`,
          value: `Mutes: ${mutes}\nKicks: ${kicks}\nBans: ${bans}`,
          inline: true,
        },
      )
      .setTimestamp();

    inter.editReply({ embeds: [embed] });
  },
};
