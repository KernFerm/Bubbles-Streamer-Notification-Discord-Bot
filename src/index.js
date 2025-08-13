// src/index.js
require("sapphire-plugin-modal-commands/register");
const { SapphireClient } = require("@sapphire/framework");
const { ActivityType, IntentsBitField } = require("discord.js");
const { guildSettings } = require("../db");
const config = require("../config.json");
const streamAlerts = require("./utils/streamAlerts");

const activities = [
  {
    text: "on {streamerCount} streams | {serverCount} servers",
    type: ActivityType.Playing,
  },
  {
    text: "over {streamerCount} live streams | {serverCount} servers",
    type: ActivityType.Watching,
  },
  {
    text: "to {streamerCount} streamers | {serverCount} servers",
    type: ActivityType.Listening,
  },
];

const client = new SapphireClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
  ],
});

client.once("ready", () => {
  console.log(`Bot is online! Logged in as ${client.user.tag}`);
  console.log(`Serving ${client.guilds.cache.size} guilds`);
  
  streamAlerts.init(client);

  let activityIndex = 0;

  const updateActivity = async () => {
    try {
      let totalStreamers = 0;

      client.guilds.cache.each((guild) => {
        const guildStreamers = guildSettings.get(guild.id, "streamers", []);
        totalStreamers += guildStreamers.length;
      });

      const serverCount = client.guilds.cache.size;

      const activity = activities[activityIndex % activities.length];
      const formattedText = activity.text
        .replace("{streamerCount}", totalStreamers)
        .replace("{serverCount}", serverCount);

      await client.user.setActivity(formattedText, { type: activity.type });

      activityIndex++;
    } catch (error) {
      console.error("Error updating bot activity:", error);
    }
  };

  // Initial activity update
  updateActivity();
  
  // Update activity every 30 seconds
  setInterval(updateActivity, 30000);
});

// Error handling
client.on("error", (error) => {
  console.error("Discord client error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

client.login(config.token).catch((error) => {
  console.error("Failed to login:", error);
  process.exit(1);
});
