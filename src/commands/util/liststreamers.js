// src/commands/util/liststreamers.js
const { Command } = require("@sapphire/framework");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const { checkTwitchLive } = require("../../utils/twitch");
const { checkYouTubeLive } = require("../../utils/youtube");
const { checkRumbleLive } = require("../../utils/rumble");
const { checkKickLive } = require("../../utils/kick");
const { checkTikTokLive } = require("../../utils/tiktok");

class ListStreamersCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "liststreamers",
      description: "List all tracked streamers.",
      category: "util",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const guildId = interaction.guildId;
      const streamers = guildSettings.get(guildId, "streamers", []);

      if (streamers.length === 0) {
        const embed = createEmbed({
          title: "📝 Tracked Streamers",
          description: "No streamers are being tracked currently.\n\nUse `/addstreamer` to start tracking streamers!",
          color: "#ff9900",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      // Send initial message
      const loadingEmbed = createEmbed({
        title: "📝 Tracked Streamers",
        description: "🔄 Checking live status for all streamers...",
        color: "#0099ff",
      });
      await interaction.followUp({ embeds: [loadingEmbed] });

      // Check live status for all streamers in real-time
      const updatedStreamers = [];
      const platformCheckers = {
        twitch: checkTwitchLive,
        youtube: checkYouTubeLive,
        rumble: checkRumbleLive,
        kick: checkKickLive,
        tiktok: checkTikTokLive,
      };

      for (let streamer of streamers) {
        try {
          const checker = platformCheckers[streamer.platform.toLowerCase()];
          if (checker) {
            const liveInfo = await checker(streamer);
            updatedStreamers.push({
              ...streamer,
              isLive: liveInfo.isLive,
              title: liveInfo.streamer.title || streamer.title,
              game: liveInfo.streamer.game || streamer.game,
              viewers: liveInfo.streamer.viewers || streamer.viewers,
            });
          } else {
            updatedStreamers.push(streamer);
          }
        } catch (error) {
          console.error(`Error checking ${streamer.name}:`, error);
          updatedStreamers.push(streamer); // Use cached data if check fails
        }
      }

      // Group streamers by platform
      const platformGroups = updatedStreamers.reduce((acc, streamer) => {
        const platform = streamer.platform.toLowerCase();
        if (!acc[platform]) acc[platform] = [];
        acc[platform].push(streamer);
        return acc;
      }, {});

      const platformEmojis = {
        twitch: '�',
        youtube: '�',
        kick: '�',
        rumble: '🟢',
        tiktok: '⚫',
      };

      const fields = [];
      
      for (const [platform, platformStreamers] of Object.entries(platformGroups)) {
        const emoji = platformEmojis[platform] || '📺';
        const streamersList = platformStreamers
          .map((streamer, index) => {
            const status = streamer.isLive ? '🔴 **LIVE**' : '⚫ Offline';
            const gameInfo = streamer.isLive && streamer.game ? ` • ${streamer.game}` : '';
            const viewerInfo = streamer.isLive && streamer.viewers ? ` • ${this.formatNumber(streamer.viewers)} viewers` : '';
            const lastLive = streamer.lastLiveAt 
              ? `\nLast live: <t:${Math.floor(new Date(streamer.lastLiveAt).getTime() / 1000)}:R>`
              : '';
            
            return `${index + 1}. **${streamer.name}** ${status}${gameInfo}${viewerInfo}\n   📢 <#${streamer.channelID}>${lastLive}`;
          })
          .join('\n\n');

        fields.push({
          name: `${emoji} ${platform.charAt(0).toUpperCase() + platform.slice(1)} (${platformStreamers.length})`,
          value: streamersList.length > 1024 ? streamersList.substring(0, 1021) + '...' : streamersList,
          inline: false,
        });
      }

      const liveCount = updatedStreamers.filter(s => s.isLive).length;
      const totalCount = updatedStreamers.length;

      const embed = createEmbed({
        title: "📝 Tracked Streamers",
        description: `**${totalCount}** streamers tracked • **${liveCount}** currently live\n\n*Real-time status checked*`,
        fields: fields,
        color: liveCount > 0 ? "#ff0000" : "#0099ff",
        timestamp: true,
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in liststreamers command:", error);
      
      const errorEmbed = createEmbed({
        title: "❌ Error",
        description: "An error occurred while retrieving the streamers list.",
        color: "#ff0000",
      });
      
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }

  // Helper function for number formatting
  formatNumber(num) {
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
}

module.exports = ListStreamersCommand;
