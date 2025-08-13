// src/index.js
require("dotenv").config();
const { SapphireClient } = require("@sapphire/framework");
const { ActivityType, IntentsBitField } = require("discord.js");
const { guildSettings } = require("../db");

// Configuration from environment variables
let config;
try {
  config = {
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.DISCORD_APPLICATION_ID,
    color: process.env.BOT_COLOR || "#61CB2B",
    footerText: process.env.FOOTER_TEXT || "Streamer Alerts Bot",
    footerIcon: process.env.FOOTER_ICON || "https://i.ibb.co/Bqs3jh7/6302741.png"
  };
} catch (error) {
  console.error("⚠️  Configuration Error: Please set up your environment variables");
  console.error("See .env.example for required environment variables");
  process.exit(1);
}

// Validate required configuration
if (!config.token) {
  console.error("❌ Error: DISCORD_TOKEN is required!");
  console.error("Please set DISCORD_TOKEN in your .env file");
  process.exit(1);
}

if (!config.applicationId) {
  console.error("⚠️  Warning: DISCORD_APPLICATION_ID is not set!");
  console.error("This may cause issues with slash commands and OAuth2.");
  console.error("Please add DISCORD_APPLICATION_ID to your .env file");
}

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
  // Set the application ID if available
  ...(config.applicationId && { applicationId: config.applicationId }),
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
