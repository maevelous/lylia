const { getAllUsers } = require("../../utils/db/levels");
const Paginator = require("../../classes/Paginator");
const { expToLevels } = require("../../utils/levels");
const { colors } = require("../../utils/entities");

module.exports = {
  name: "lb",
  ephemeral: false,
  description: "Shows the level leaderboard!",
  showHelp: true,

  execute({ client, inter }) {
    const entries = getAllUsers();
    const sorted = entries.sort((a, b) => b.xp - a.xp);
    const res = sorted.map((x, i) => {
      return `${i + 1}. <@${x.id}> - Level ${expToLevels(x.xp)} - ${x.xp} XP`;
    });

    const paginator = new Paginator();
    paginator.listToEmbeds(res, "", {
      color: colors.default,
      title: `Leaderboard - ${entries.length} ${entries.length === 1 ? "user" : "users"}`,
    });
    paginator.paginate({ client, interaction: inter });
  },
};
