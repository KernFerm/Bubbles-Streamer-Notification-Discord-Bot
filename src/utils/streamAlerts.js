// src/utils/streamAlerts.js
const { guildSettings } = require("../../db");
const { createEmbed } = require("./embed");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { checkTwitchLive } = require("./twitch");
const { checkYouTubeLive } = require("./youtube");
const { checkRumbleLive } = require("./rumble");
const { checkKickLive } = require("./kick");
// const { checkTikTokLive } = require("./tiktok");

const lastLiveData = new Map();

module.exports = {
  init: (client) => {
    console.log("Initializing stream alerts system...");
    // Check every minute
    setInterval(() => checkStreamers(client), 60 * 1000);
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

          const shouldSendEmbed =
            liveInfo.isLive &&
            (!lastLive || lastLive.title !== liveInfo.streamer.title);

          if (shouldSendEmbed) {
            const channel = client.channels.cache.get(streamers[i].channelID);
            if (channel) {
              try {
                const { embed, components } = createStreamerEmbed(liveInfo.streamer);
                await channel.send({ embeds: [embed], components });
                console.log(`Sent live alert for ${streamers[i].name} in ${guild.name}`);
              } catch (channelError) {
                console.error(`Failed to send message to channel ${streamers[i].channelID}:`, channelError);
              }
            } else {
              console.warn(`Channel ${streamers[i].channelID} not found for streamer ${streamers[i].name}`);
            }

            lastLiveData.set(liveStreamKey, {
              title: liveInfo.streamer.title,
              imageUrl: liveInfo.streamer.imageUrl,
              isLive: liveInfo.isLive,
            });
          }

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
    // tiktok: checkTikTokLive,
  };

  const checker = platformCheckers[streamer.platform.toLowerCase()];
  if (checker) {
    return await checker(streamer);
  }
  
  console.warn(`No checker available for platform: ${streamer.platform}`);
  return { isLive: false, streamer };
}

function createStreamerEmbed(streamer) {
  const platformDetails = {
    twitch: { color: '#9146FF', emoji: '🟪' },
    youtube: { color: '#FF0000', emoji: '🟥' },
    rumble: { color: '#90EE90', emoji: '🟩' },
    kick: { color: '#00FF00', emoji: '🟩' },
    tiktok: { color: '#000000', emoji: '🔳' },
  };

  const currentPlatform = platformDetails[streamer.platform.toLowerCase()] || { color: '#0099ff', emoji: '🔴' };

  let description = `${streamer.username || streamer.name} is live now on [${
    streamer.platform
  }](${streamer.url}).`;
  
  if (streamer.bio) {
    description += "\n\n" + streamer.bio;
  }

  const fields = [];
  
  if (streamer.viewers) {
    fields.push({
      name: "👀 Viewers",
      value: streamer.viewers.toString(),
      inline: true,
    });
  }
  
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
  }
  
  const followerLabel = streamer.platform.toLowerCase() === "youtube" ? "👥 Subscribers" : "👥 Followers";
  if (streamer.followersCount) {
    fields.push({
      name: followerLabel,
      value: streamer.followersCount.toString(),
      inline: true,
    });
  }
  
  if (streamer.verified) {
    fields.push({ name: "✅ Verified", value: "Yes", inline: true });
  }

  const button = new ButtonBuilder()
    .setLabel(`Watch ${streamer.name} on ${streamer.platform}!`)
    .setStyle(ButtonStyle.Link)
    .setURL(streamer.url)
    .setEmoji(currentPlatform.emoji);

  const row = new ActionRowBuilder().addComponents(button);

  return {
    embed: createEmbed({
      title: streamer.title || "Live Stream",
      url: streamer.url,
      description: description,
      color: currentPlatform.color,
      image: streamer.imageUrl || undefined,
      fields: fields,
      timestamp: true,
    }),
    components: [row]
  };
}
