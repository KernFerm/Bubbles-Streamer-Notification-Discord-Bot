// src/commands/util/liststreamers.js
const { Command } = require("@sapphire/framework");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

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

      // Group streamers by platform
      const platformGroups = streamers.reduce((acc, streamer) => {
        const platform = streamer.platform.toLowerCase();
        if (!acc[platform]) acc[platform] = [];
        acc[platform].push(streamer);
        return acc;
      }, {});

      const platformEmojis = {
        twitch: '🟪',
        youtube: '🟥',
        kick: '🟩',
        rumble: '🟢',
        tiktok: '🔳',
      };

      const fields = [];
      
      for (const [platform, platformStreamers] of Object.entries(platformGroups)) {
        const emoji = platformEmojis[platform] || '📺';
        const streamersList = platformStreamers
          .map((streamer, index) => {
            const status = streamer.isLive ? '🔴 **LIVE**' : '⚫ Offline';
            const lastLive = streamer.lastLiveAt 
              ? `\nLast live: <t:${Math.floor(new Date(streamer.lastLiveAt).getTime() / 1000)}:R>`
              : '';
            
            return `${index + 1}. **${streamer.name}** ${status}\n   📢 <#${streamer.channelID}>${lastLive}`;
          })
          .join('\n\n');

        fields.push({
          name: `${emoji} ${platform.charAt(0).toUpperCase() + platform.slice(1)} (${platformStreamers.length})`,
          value: streamersList.length > 1024 ? streamersList.substring(0, 1021) + '...' : streamersList,
          inline: false,
        });
      }

      const liveCount = streamers.filter(s => s.isLive).length;
      const totalCount = streamers.length;

      const embed = createEmbed({
        title: "📝 Tracked Streamers",
        description: `**${totalCount}** streamers tracked • **${liveCount}** currently live`,
        fields: fields,
        color: liveCount > 0 ? "#ff0000" : "#0099ff",
        timestamp: true,
      });

      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Error in liststreamers command:", error);
      
      const errorEmbed = createEmbed({
        title: "❌ Error",
        description: "An error occurred while retrieving the streamers list.",
        color: "#ff0000",
      });
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
}

module.exports = ListStreamersCommand;
