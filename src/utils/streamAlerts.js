// src/utils/streamAlerts.js
const { guildSettings } = require("../../db");
const { createEmbed } = require("./embed");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { checkTwitchLive } = require("./twitch");
const { checkYouTubeLive } = require("./youtube");
const { checkRumbleLive } = require("./rumble");
const { checkKickLive } = require("./kick");
const { checkTikTokLive } = require("./tiktok");
const { checkNimoTVLive } = require("./nimotv");

const lastLiveData = new Map();

module.exports = {
  init: (client) => {
    console.log("Initializing stream alerts system...");
    // Check every 1 hour
    setInterval(() => checkStreamers(client), 60 * 60 * 1000);
    // Initial check after 10 seconds
    setTimeout(() => checkStreamers(client), 10000);
  },
};

async function checkStreamers(client) {
  if (client.guilds.cache.size === 0) {
    console.log("No guilds available for stream checking");
    return;
  }

  console.log(`Checking streams for ${client.guilds.cache.size} guilds...`);

  for (const [guildId, guild] of client.guilds.cache) {
    try {
      let streamers = guildSettings.get(guildId, "streamers") || [];

      if (streamers.length === 0) continue;

      console.log(`Checking ${streamers.length} streamers for guild ${guild.name}`);

      for (let i = 0; i < streamers.length; i++) {
        try {
          const liveInfo = await checkIfLive(streamers[i]);
          const liveStreamKey = `${guildId}-${streamers[i].id}`;
          const lastLive = lastLiveData.get(liveStreamKey);

          // Send alert when:
          // 1. Going from offline to online
          // 2. Game/category changes while live
          const shouldSendEmbed =
            liveInfo.isLive && (
              !lastLive || // First time going live
              (lastLive && lastLive.game !== liveInfo.streamer.game) // Game changed
            );

          // Check for offline notification (going from live to offline)
          const shouldSendOfflineEmbed = 
            !liveInfo.isLive && lastLive && lastLive.isLive;

          if (shouldSendEmbed) {
            console.log(`Attempting to send alert for ${streamers[i].name} to channel ID: ${streamers[i].channelID}`);
            const channel = client.channels.cache.get(streamers[i].channelID);
            if (channel) {
              console.log(`Found channel: ${channel.name} (${channel.id})`);
              try {
                const { embed, components } = createStreamerEmbed(liveInfo.streamer);
                await channel.send({ embeds: [embed], components });
                
                // Log different types of alerts
                if (!lastLive) {
                  console.log(`✅ Sent live alert for ${streamers[i].name} in ${guild.name} to #${channel.name}`);
                } else if (lastLive.game !== liveInfo.streamer.game) {
                  console.log(`✅ Sent game change alert for ${streamers[i].name} in ${guild.name} to #${channel.name} (${lastLive.game || 'Unknown'} → ${liveInfo.streamer.game || 'Unknown'})`);
                }
              } catch (channelError) {
                console.error(`❌ Failed to send message to channel ${streamers[i].channelID} (#${channel.name}):`, channelError);
              }
            } else {
              console.error(`❌ Channel ${streamers[i].channelID} not found for streamer ${streamers[i].name}. Available channels:`, 
                client.channels.cache.filter(c => c.type === 0).map(c => `#${c.name} (${c.id})`).join(', '));
            }

            lastLiveData.set(liveStreamKey, {
              title: liveInfo.streamer.title,
              imageUrl: liveInfo.streamer.imageUrl,
              isLive: liveInfo.isLive,
              game: liveInfo.streamer.game,
            });
          }

          // Send offline notification
          if (shouldSendOfflineEmbed) {
            console.log(`Attempting to send offline alert for ${streamers[i].name} to channel ID: ${streamers[i].channelID}`);
            const channel = client.channels.cache.get(streamers[i].channelID);
            if (channel) {
              try {
                const { embed, components } = createOfflineEmbed(streamers[i], lastLive);
                await channel.send({ embeds: [embed], components });
                console.log(`✅ Sent offline alert for ${streamers[i].name} in ${guild.name} to #${channel.name}`);
              } catch (channelError) {
                console.error(`❌ Failed to send offline message to channel ${streamers[i].channelID} (#${channel.name}):`, channelError);
              }
            }
          }

          // Update live data if streamer is live (even if no alert was sent)
          if (liveInfo.isLive && !shouldSendEmbed && lastLive) {
            lastLiveData.set(liveStreamKey, {
              title: liveInfo.streamer.title,
              imageUrl: liveInfo.streamer.imageUrl,
              isLive: liveInfo.isLive,
              game: liveInfo.streamer.game,
            });
          }

          // Remove from tracking when they go offline
          if (!liveInfo.isLive && lastLiveData.has(liveStreamKey)) {
            lastLiveData.delete(liveStreamKey);
          }

          streamers[i] = {
            ...streamers[i],
            ...liveInfo.streamer,
            isLive: liveInfo.isLive,
            lastLiveAt: liveInfo.isLive ? new Date() : streamers[i].lastLiveAt,
          };
        } catch (error) {
          console.error(`Error during live check for ${streamers[i].name}:`, error);
          streamers[i].error = error.message;
        }
      }

      await guildSettings.set(guildId, "streamers", streamers);
    } catch (guildError) {
      console.error(`Error checking streamers for guild ${guildId}:`, guildError);
    }
  }
}

async function checkIfLive(streamer) {
  const platformCheckers = {
    twitch: checkTwitchLive,
    youtube: checkYouTubeLive,
    rumble: checkRumbleLive,
    kick: checkKickLive,
    tiktok: checkTikTokLive,
    nimotv: checkNimoTVLive,
  };

  const checker = platformCheckers[streamer.platform.toLowerCase()];
  if (checker) {
    return await checker(streamer);
  }
  
  console.warn(`No checker available for platform: ${streamer.platform}`);
  return { isLive: false, streamer };
}

/**
 * Format numbers for better display (e.g., 1234 -> 1.2K)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(num) {
  if (!num || num < 1000) {
    return num ? num.toString() : "0";
  }
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
}

function createStreamerEmbed(streamer) {
  // Debug log to see what data we have
  console.log('Creating embed for streamer:', {
    name: streamer.name,
    viewers: streamer.viewers,
    followersCount: streamer.followersCount,
    game: streamer.game,
    startedAt: streamer.startedAt,
    title: streamer.title
  });

  const platformDetails = {
    twitch: { color: '#9146FF', emoji: '🟣' },
    youtube: { color: '#FF0000', emoji: '🔴' },
    rumble: { color: '#90EE90', emoji: '🟢' },
    kick: { color: '#00FF00', emoji: '💚' },
    tiktok: { color: '#000000', emoji: '⚫' },
    nimotv: { color: '#FF6B35', emoji: '🔶' },
  };

  const currentPlatform = platformDetails[streamer.platform.toLowerCase()] || { color: '#0099ff', emoji: '🔴' };

  let description = `${currentPlatform.emoji} **${streamer.username || streamer.name}** is live now on [${
    streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)
  }](${streamer.url})!`;
  
  if (streamer.bio) {
    description += "\n\n📝 " + streamer.bio;
  }

  const fields = [];
  
  // Add game/category if available
  if (streamer.game) {
    fields.push({
      name: "🎮 Playing",
      value: streamer.game,
      inline: true,
    });
  }
  
  // Always show viewers field
  fields.push({
    name: "👀 Viewers",
    value: streamer.viewers ? formatNumber(streamer.viewers) : "Live",
    inline: true,
  });
  
  // Always show started time or live indicator
  if (streamer.startedAt) {
    let startedAtDate = new Date(streamer.startedAt);
    if (!startedAtDate.getTime()) {
      startedAtDate = new Date(streamer.startedAt + 'Z');
    }
    
    if (!isNaN(startedAtDate.getTime())) {
      const discordTimestamp = Math.floor(startedAtDate.getTime() / 1000);
      fields.push({
        name: "⏰ Started At",
        value: `<t:${discordTimestamp}:R>`,
        inline: true,
      });
    }
  } else {
    fields.push({
      name: "⏰ Status",
      value: "Live Now",
      inline: true,
    });
  }
  
  // Always show followers if available
  const followerLabel = streamer.platform.toLowerCase() === "youtube" ? "👥 Subscribers" : "👥 Followers";
  if (streamer.followersCount) {
    fields.push({
      name: followerLabel,
      value: formatNumber(streamer.followersCount),
      inline: true,
    });
  }
  
  if (streamer.verified) {
    fields.push({ name: "✅ Verified", value: "Yes", inline: true });
  }

  const button = new ButtonBuilder()
    .setLabel(`Watch on ${streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)}`)
    .setStyle(ButtonStyle.Link)
    .setURL(streamer.url)
    .setEmoji(currentPlatform.emoji);

  const row = new ActionRowBuilder().addComponents(button);

  return {
    embed: createEmbed({
      title: `🔴 ${streamer.title || "Live Stream"}`,
      url: streamer.url,
      description: description,
      color: currentPlatform.color,
      image: streamer.imageUrl || undefined,
      fields: fields,
      timestamp: true,
      footer: {
        text: `Live on ${streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)}`,
        iconURL: streamer.profileImageUrl || undefined
      }
    }),
    components: [row]
  };
}

function createOfflineEmbed(streamer, lastLiveData) {
  const platformDetails = {
    twitch: { color: '#9146FF', emoji: '🟣' },
    youtube: { color: '#FF0000', emoji: '🔴' },
    rumble: { color: '#90EE90', emoji: '🟢' },
    kick: { color: '#00FF00', emoji: '💚' },
    tiktok: { color: '#000000', emoji: '⚫' },
    nimotv: { color: '#FF6B35', emoji: '🔶' },
  };

  const currentPlatform = platformDetails[streamer.platform.toLowerCase()] || { color: '#6B6B6B', emoji: '⚫' };

  let description = `${currentPlatform.emoji} **${streamer.username || streamer.name}** has ended their stream on [${
    streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)
  }](${getStreamUrl(streamer)}).`;

  const fields = [];
  
  // Show what they were playing when they went offline
  if (lastLiveData.game) {
    fields.push({
      name: "🎮 Was Playing",
      value: lastLiveData.game,
      inline: true,
    });
  }

  // Show stream ended time
  fields.push({
    name: "⏰ Stream Ended",
    value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
    inline: true,
  });

  const button = new ButtonBuilder()
    .setLabel(`Visit ${streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)}`)
    .setStyle(ButtonStyle.Link)
    .setURL(getStreamUrl(streamer))
    .setEmoji(currentPlatform.emoji);

  const row = new ActionRowBuilder().addComponents(button);

  return {
    embed: createEmbed({
      title: `⚫ Stream Ended`,
      url: getStreamUrl(streamer),
      description: description,
      color: '#6B6B6B', // Gray color for offline
      fields: fields,
      timestamp: true,
      footer: {
        text: `Stream ended on ${streamer.platform.charAt(0).toUpperCase() + streamer.platform.slice(1)}`,
        iconURL: undefined
      }
    }),
    components: [row]
  };
}

// Helper function to get the correct URL for each platform
function getStreamUrl(streamer) {
  const platform = streamer.platform.toLowerCase();
  const name = streamer.name;
  
  switch (platform) {
    case 'twitch':
      return `https://twitch.tv/${name}`;
    case 'youtube':
      return `https://www.youtube.com/@${name}`;
    case 'kick':
      return `https://kick.com/${name}`;
    case 'rumble':
      return `https://rumble.com/c/${name}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${name}`;
    case 'nimotv':
      return `https://www.nimo.tv/${name}`;
    default:
      return `https://twitch.tv/${name}`; // Default fallback
  }
}
