const { Player } = require("discord-player");
const Genius = require("genius-lyrics");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { initDB } = require("./utils/db");

global.client = new Client({
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  disableMentions: "everyone",
});

client.config = require("./config");

const player = new Player(client, client.config.opt.discordPlayer);
global.genius = new Genius.Client();
player.extractors.loadDefault();

require("./src/loader");

initDB();

client.login(client.config.app.token);
