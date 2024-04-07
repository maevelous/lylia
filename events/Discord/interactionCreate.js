const { EmbedBuilder, InteractionType } = require("discord.js");
const { useQueue } = require("discord-player");
const fs = require("fs");
const { getGuildConfig } = require("../../utils/db");

module.exports = async (client, inter) => {

  if (inter.type === InteractionType.ApplicationCommand) {
    const DJ = client.config.opt.DJ;
    const command = client.commands.get(inter.commandName);
    await inter.deferReply({
      ephemeral: command.ephemeral
    });

    const djCommands = fs.readdirSync("./commands/music").map((x) => {
      return require(`../../commands/music/${x}`);
    });
    const isDjCommand = djCommands.some((cmd) => cmd.name === command.name);

    const config = getGuildConfig(inter.guildId);
    const sentInMusicChannel = !!config && config.queue_channel_id === inter.channelId;

    if (isDjCommand && !sentInMusicChannel) {
      return inter.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | Music commands can only be used in <#${config.queue_channel_id}>`,
            ),
        ],
        ephemeral: true,
      });
    }

    if (!command)
      return (
        inter.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription("❌ | Do NOT contact Maeve"),
          ],
          ephemeral: true,
        }),
        client.slash.delete(inter.commandName)
      );
    if (
      command.permissions &&
      !inter.member.permissions.has(command.permissions)
    )
      return inter.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | You need do not have the proper permissions to execute this command`,
            ),
        ],
        ephemeral: true,
      });
    if (
      DJ.enabled &&
      DJ.commands.includes(command) &&
      !inter.member._roles.includes(
        inter.guild.roles.cache.find((x) => x.name === DJ.roleName).id,
      )
    )
      return inter.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
              `❌ | This command is reserved For members with \`${DJ.roleName}\` `,
            ),
        ],
        ephemeral: true,
      });
    if (command.voiceChannel) {
      if (!inter.member.voice.channel)
        return inter.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in a Voice Channel`),
          ],
          ephemeral: true,
        });
      if (
        inter.guild.members.me.voice.channel &&
        inter.member.voice.channel.id !==
        inter.guild.members.me.voice.channel.id
      )
        return inter.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(`❌ | You are not in the same Voice Channel`),
          ],
          ephemeral: true,
        });
    }
    command.execute({ inter, client });
  }
  if (inter.type === InteractionType.MessageComponent) {
    const customId = JSON.parse(inter.customId);
    const file_of_button = customId.ffb;
    const queue = useQueue(inter.guild);

    if (file_of_button) {
      delete require.cache[
        require.resolve(`../../src/buttons/${file_of_button}.js`)
      ];
      const button = require(`../../src/buttons/${file_of_button}.js`);
      if (button) return button({ client, inter, customId, queue });
    }
  }
};
