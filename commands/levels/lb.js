const { getAllUsers } = require("../../utils/db/levels");
const Paginator = require("../../classes/Paginator");
const { expToLevels } = require("../../utils/levels");
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

module.exports = {
  name: "lb",
  ephemeral: false,
  description: "Shows the level leaderboard!",
  showHelp: true,
  options: [
    {
      name: "global",
      description: "Show global leaderboard",
      type: COMMAND_OPTIONS.BOOLEAN,
      required: false,
    },
  ],

  async execute({ client, inter }) {
    const global = inter.options.getBoolean("global") ?? false;

    const entries = getAllUsers();
    const sorted = entries.sort((a, b) => b.xp - a.xp);
    const res = sorted.map((x) => {
      return `<@${x.id}> - Level ${expToLevels(x.xp)} - ${x.xp} XP`;
    });

    const all = global
      ? res
      : (await filterUsersByGuild(entries, inter.guild.id)).filter(
          (x) => x !== null,
        );

    const paginator = new Paginator();
    paginator.listToEmbeds(all, "", {
      color: colors.default,
      title: `Leaderboard - ${all.length} ${all.length === 1 ? "user" : "users"}`,
    });
    paginator.paginate({ client, interaction: inter });
  },
};
