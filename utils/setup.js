const fs = require("fs");
const { PermissionsBitField, AttachmentBuilder, ChannelType, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { updateQueue } = require("../utils/queue");
const { getEmbedControls } = require("../utils/misc");
const {
  insertGuildFromMusicSetup,
  insertGuildFromModerationSetup,
} = require("../utils/db");
const { colors } = require("../utils/entities");

const setupMusicChannel = async function (_, inter) {
  const queue = useQueue(inter.guild);

  if (!inter.member.permissions.has(PermissionsBitField.Flags.Administrator))
    return inter.editReply({
      content: "Please ask an administrator to run the setup.",
    });

  const existingMusicChannel = inter.guild.channels.cache.find(
    (ch) => ch.name === "lylia-music",
  );
  if (existingMusicChannel)
    return inter.editReply({
      content: "A music channel already exists in this server",
    });

  let channel = existingMusicChannel
    ? null
    : await inter.guild.channels
        .create({
          name: "lylia-music",
          type: ChannelType.GuildText,
        })
        .catch(() => null);
  if (channel === null && !existingMusicChannel)
    return inter.editReply({ content: "Could not create channel." });

  channel ??= existingMusicChannel;

  const assets = fs.readdirSync("./assets/embed");
  const asset = new AttachmentBuilder(
    `./assets/embed/${assets[Math.floor(Math.random() * assets.length)]}`,
  );
  const assetName = asset.attachment.split("/")[3];
  const banner = new AttachmentBuilder(`./assets/banner.png`);

  const embed = new EmbedBuilder()
    .setTitle("Currently not playing")
    .setImage(`attachment://${assetName}`)
    .setColor(colors.default);

  const bannerMsg = await channel.send({
    files: [banner],
    fetchReply: true,
  });

  const msg = await channel.send({
    content:
      "\uFEFF\n__**Queue**__:\nJoin a voice channel and send a song name in this channel or use the command to add it to the queue!",
    embeds: [embed],
    files: [asset],
    fetchReply: true,
    components: [getEmbedControls()],
  });

  const replyembed = new EmbedBuilder()
    .setTitle("Song request channel has been created!")
    .setDescription(
      `Created channel: <#${channel.id}>\n` +
        `_You can rename and move this channel if you want to_\n` +
        `Most of my music commands will only work in <#${channel.id}> from now on`,
    )
    .setColor(colors.default);

  inter.editReply({
    embeds: [replyembed],
  });

  const payload = {
    id: inter.guild.id,
    queue_channel_id: channel.id,
    queue_message_id: msg.id,
    queue_banner_id: bannerMsg.id,
    song: null,
  };

  insertGuildFromMusicSetup(payload);
  updateQueue(queue);
};

const setupModeration = async function (client, inter) {
  if (!inter.member.permissions.has(PermissionsBitField.Flags.Administrator))
    return inter.editReply({
      content: "Please ask an administrator to run the setup.",
    });

  let notice = "";

  const existingMutedRole = inter.guild.roles.cache.find(
    (role) => role.name === "Muted",
  );
  if (existingMutedRole) {
    notice += "A muted role already exists in this server. Skipping...\n";

    await inter.editReply({
      content: notice,
    });
  }

  const roleMuted =
    existingMutedRole ??
    (await inter.guild.roles.create({
      name: "Muted",
      color: "#000000",
    }));

  inter.guild.channels.cache.forEach((channel) => {
    channel.permissionOverwrites.edit(roleMuted.id, {
      SendMessages: false,
    });
  });

  if (roleMuted !== null && !existingMutedRole) {
    notice += `Created a muted role <@&${roleMuted.id}>\n`;

    await inter.editReply({
      content: notice,
    });
  }

  const existingModRole = inter.guild.roles.cache.find(
    (role) => role.name === "Moderator",
  );
  if (existingModRole) {
    notice += "A moderator role already exists in this server. Skipping...\n";

    await inter.editReply({
      content: notice,
    });
  }

  const roleModerator =
    existingModRole ??
    (await inter.guild.roles.create({
      name: "Moderator",
      color: "#000000",
    }));

  if (roleModerator && !existingModRole) {
    notice += `Created a moderator role <@&${roleModerator.id}>\n`;
    await inter.editReply({
      content: notice,
    });
  }

  const existingLogsChannel = inter.guild.channels.cache.find(
    (ch) => ch.name === "lylia-logs",
  );

  if (existingLogsChannel) {
    notice += "A logs channel already exists in this server. Skipping...\n";

    await inter.editReply({
      content: notice,
    });
  }

  const logsChannel =
    existingLogsChannel ??
    (await inter.guild.channels
      .create({
        name: "lylia-logs",
        type: ChannelType.GuildText,
      })
      .catch(() => null));

  if (!logsChannel && !existingLogsChannel) {
    return inter.editReply({
      content: "Could not create logs channel.",
    });
  }

  logsChannel?.permissionOverwrites.edit(inter.guild.id, {
    ViewChannel: false,
  });

  if (logsChannel && !existingLogsChannel) {
    notice += `Created a logs channel <#${logsChannel.id}>`;

    await inter.editReply({
      content: notice,
    });
  }

  const payload = {
    id: inter.guild.id,
    role_muted_id: roleMuted.id,
    role_moderator_id: roleModerator.id,
    audit_channel_id: logsChannel.id,
  };
  insertGuildFromModerationSetup(payload);

  notice += "\nModeration setup complete!";
  await inter.editReply({
    content: notice,
  });
};

module.exports = {
  setupMusicChannel,
  setupModeration,
};
