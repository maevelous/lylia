const { getAllUsers } = require("../../utils/db/levels");
const Paginator = require("../../classes/Paginator");
const { expToLevels } = require("../../utils/levels");
const { colors } = require("../../utils/entities");
const { COMMAND_OPTIONS } = require("../../enums");
const { shortenNum } = require("../../utils/levels");

const filterUsersByGuild = async function (users, guildId) {
  const members = await client.guilds.cache
    .get(guildId)
    .members.fetch()
    .catch(() => null);
  if (!members) return [];

  return users.filter((user) =>
    members.some((member) => member.id === user.id),
  );
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

    const all = global
      ? sorted
      : (await filterUsersByGuild(entries, inter.guild.id)).filter(
          (x) => x !== null,
        );

    if (!all || all.length === 0) return inter.deleteReply();

    const res = all.map((x) => {
      return `${x.username} - Level ${expToLevels(x.xp)} - ${shortenNum(x.xp, true)} XP`;
    });

    const paginator = new Paginator();
    paginator.listToEmbeds(res, "", {
      color: colors.default,
      title: `Leaderboard - ${res.length} ${res.length === 1 ? "user" : "users"}`,
    });
    paginator.paginate({ client, interaction: inter });
  },
};
