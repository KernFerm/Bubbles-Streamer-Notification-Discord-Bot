// db.js
const Enmap = require("enmap");

/**
 * Streamer data structure:
 * {
 *   id: String, // A unique identifier for the streamer (format: "platform:name")
 *   name: String, // The streamer's name/username
 *   platform: String, // The platform the streamer is on (e.g., twitch, youtube, kick, rumble, tiktok)
 *   channelID: String, // The Discord channel ID where alerts should be sent
 *   platformUserID: String, // The streamer's user ID on the platform (if applicable)
 *   isLive: Boolean, // Whether the streamer is currently live
 *   lastLiveAt: Date, // The last time the streamer was detected as live
 *   addedBy: String, // User ID of who added this streamer
 *   addedAt: Date, // When this streamer was added to tracking
 *   error: String, // Error message if the last status check failed
 *   
 *   // Live stream data (populated when live)
 *   title: String, // Current stream title
 *   description: String, // Stream description
 *   imageUrl: String, // Stream thumbnail URL
 *   url: String, // Direct link to the stream
 *   viewers: Number, // Current number of viewers
 *   startedAt: String, // ISO date string when stream started
 *   bio: String, // Streamer's bio/description
 *   followersCount: Number, // Number of followers/subscribers
 *   verified: Boolean, // Whether the streamer is verified on the platform
 *   profileImageUrl: String, // Streamer's profile picture URL
 * }
 */

/**
 * Guild settings data structure:
 * {
 *   streamers: Array, // Array of streamer objects
 *   settings: Object, // Guild-specific settings (future use)
 * }
 */

/**
 * @type {import("enmap").Enmap}
 * Custom settings for each guild.
 */
const guildSettings = new Enmap({
  name: "guildSettings",
  autoEnsure: {
    streamers: [],
    settings: {
      alertChannel: null,
      enabledPlatforms: ["twitch", "youtube", "kick", "rumble", "tiktok"],
      alertRole: null,
      customMessage: null,
    },
  },
  ensureProps: true,
});

/**
 * Get all streamers across all guilds
 * @returns {Array} Array of all streamer objects with guild info
 */
function getAllStreamers() {
  const allStreamers = [];
  
  guildSettings.forEach((guildData, guildId) => {
    if (guildData.streamers && Array.isArray(guildData.streamers)) {
      guildData.streamers.forEach(streamer => {
        allStreamers.push({
          ...streamer,
          guildId,
        });
      });
    }
  });
  
  return allStreamers;
}

/**
 * Get streamers by platform
 * @param {string} platform - Platform name
 * @returns {Array} Array of streamers for the specified platform
 */
function getStreamersByPlatform(platform) {
  return getAllStreamers().filter(streamer => 
    streamer.platform.toLowerCase() === platform.toLowerCase()
  );
}

/**
 * Clean up old or invalid streamer data
 */
function cleanupStreamers() {
  let cleaned = 0;
  
  guildSettings.forEach((guildData, guildId) => {
    if (guildData.streamers && Array.isArray(guildData.streamers)) {
      const originalLength = guildData.streamers.length;
      
      // Remove streamers with invalid data
      guildData.streamers = guildData.streamers.filter(streamer => {
        return streamer.name && 
               streamer.platform && 
               streamer.channelID &&
               typeof streamer.name === 'string' &&
               typeof streamer.platform === 'string' &&
               typeof streamer.channelID === 'string';
      });
      
      if (guildData.streamers.length !== originalLength) {
        guildSettings.set(guildId, guildData);
        cleaned += originalLength - guildData.streamers.length;
      }
    }
  });
  
  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} invalid streamer entries`);
  }
}

module.exports = {
  guildSettings,
  getAllStreamers,
  getStreamersByPlatform,
  cleanupStreamers,
};
