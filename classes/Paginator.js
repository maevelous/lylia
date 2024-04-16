const { colors } = require("../utils/entities");

Number.prototype.mod = function (n) {
  "use strict";
  return ((this % n) + n) % n;
};

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

class Paginator {
  embeds;

  constructor(embeds = []) {
    this.embeds = embeds;
  }

  /**
   * Takes in a list of strings and creates embeds from them.
   *
   * @param list the list of strings
   * @param baseString an optional string to be displayed on every page
   * @param options object containing paremeters for the embed
   */
  listToEmbeds(list, baseString, options = {}) {
    if (!baseString) baseString = "";
    let embedStrings = [];
    for (let i = 0; i < list.length; i++) {
      if (!embedStrings[Math.floor(i / 10)]) {
        embedStrings[Math.floor(i / 10)] = "";
      }
      embedStrings[Math.floor(i / 10)] += `${i + 1}. ${list[i]}\n`;
    }
    if (embedStrings.length === 0) embedStrings = [""];

    let embeds = [];
    for (let i = 0; i < embedStrings.length; i++) {
      let embed = new EmbedBuilder()
        .setColor(options.color ? options.color : colors.default)
        .setDescription(`${baseString}\n\n${embedStrings[i]}`)
        .setFooter({ text: `Page ${i + 1} / ${embedStrings.length}` })
        .setTimestamp();

      if (options.title) embed.setTitle(options.title);

      embeds.push(embed);
    }

    this.embeds = embeds;
    return embeds;
  }

  returnPaginationRow(counter) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back_all")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⏪")
        .setDisabled(counter === 0),
      new ButtonBuilder()
        .setCustomId("back")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⬅️")
        .setDisabled(counter === 0),
      new ButtonBuilder()
        .setCustomId("end")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⏹️"),
      new ButtonBuilder()
        .setCustomId("forward")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➡️")
        .setDisabled(counter === this.embeds.length - 1),
      new ButtonBuilder()
        .setCustomId("forward_all")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⏩")
        .setDisabled(counter === this.embeds.length - 1),
    );
  }

  /**
   * Takes in a list of embeds to paginate.
   *
   * @param options options necessary for the pagination. Interaction and Client are necessary
   * @returns
   */
  async paginate(options) {
    const { client, interaction, ephemeral } = options;

    if (this.embeds.length === 1)
      return interaction.editReply({
        embeds: [this.embeds[0]],
        ephemeral: ephemeral,
      });

    let msg = await interaction.editReply({
      embeds: [this.embeds[0]],
      components: [this.returnPaginationRow(0)],
      fetchReply: true,
      ephemeral: ephemeral,
    });

    let counter = 0;
    const listener = async (pagInter) => {
      if (!pagInter.message) return;
      if (pagInter.user.id !== interaction.user.id) return;
      if (pagInter.message.id !== msg.id) return;

      console.log(pagInter.customId);

      if (pagInter.customId === "back_all") {
        counter = 0;
        pagInter
          .update({
            embeds: [this.embeds[counter]],
            components: [this.returnPaginationRow(counter)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "back" && counter - 1 >= 0) {
        counter--;
        pagInter
          .update({
            embeds: [this.embeds[counter]],
            components: [this.returnPaginationRow(counter)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "forward" && counter + 1 < this.embeds.length) {
        counter++;
        pagInter
          .update({
            embeds: [this.embeds[counter]],
            components: [this.returnPaginationRow(counter)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "forward_all") {
        counter = this.embeds.length - 1;
        pagInter
          .update({
            embeds: [this.embeds[counter]],
            components: [this.returnPaginationRow(counter)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "end") {
        pagInter
          .update({ embeds: [this.embeds[counter]], components: [] })
          .catch(() => {});
        client.off("interactionCreate", listener);
      }
    };

    client.on("interactionCreate", listener);
    setTimeout(() => {
      try {
        client.off("interactionCreate", listener);
      } catch {}
    }, 120000);
  }

  bazaarPaginationRow(title) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⬅️"),
      new ButtonBuilder()
        .setCustomId("switch")
        .setStyle(ButtonStyle.Secondary)
        .setLabel(title),
      new ButtonBuilder()
        .setCustomId("forward")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➡️"),
    );
  }

  async bazaarPaginate(options, list1, list2) {
    const { client, interaction } = options;

    let currentList = list1;
    let label = currentList === list1 ? "collectors" : "stats";

    let msg = await interaction.editReply({
      embeds: [currentList[0]],
      components: [this.bazaarPaginationRow(label)],
      fetchReply: true,
    });

    let counter = 0;
    const listener = async (pagInter) => {
      if (!pagInter.message) return;
      if (pagInter.user.id !== interaction.user.id) return;
      if (pagInter.message.id !== msg.id) return;

      if (pagInter.customId === "back") {
        counter--;
        pagInter
          .update({
            embeds: [currentList[counter.mod(currentList.length)]],
            components: [this.bazaarPaginationRow(label)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "switch") {
        counter = 0;
        currentList = currentList === list1 ? list2 : list1;
        label = currentList === list1 ? "collectors" : "stats";

        pagInter
          .update({
            embeds: [currentList[counter.mod(currentList.length)]],
            components: [this.bazaarPaginationRow(label)],
          })
          .catch(() => {});
      }
      if (pagInter.customId === "forward") {
        counter++;
        pagInter
          .update({
            embeds: [currentList[counter.mod(currentList.length)]],
            components: [this.bazaarPaginationRow(label)],
          })
          .catch(() => {});
      }
    };

    client.on("interactionCreate", listener);
    setTimeout(() => {
      try {
        client.off("interactionCreate", listener);
      } catch {}
    }, 120000);
  }
}

module.exports = Paginator;
