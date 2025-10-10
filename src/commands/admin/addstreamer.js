// src/commands/admin/addstreamer.js
const { Command } = require("@sapphire/framework");
const { PermissionFlagsBits } = require("discord.js");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");

class AddStreamerCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "addstreamer",
      description: "Add a streamer to track.",
      category: "admin",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption((option) =>
          option
            .setName("platform")
            .setDescription("The platform of the streamer")
            .setRequired(true)
            .addChoices(
              { name: "YouTube", value: "youtube" },
              { name: "Twitch", value: "twitch" },
              { name: "Kick", value: "kick" },
              { name: "Rumble", value: "rumble" },
              { name: "TikTok", value: "tiktok" },
              { name: "NimoTV", value: "nimotv" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the streamer")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send notifications to")
            .setRequired(true)
            .addChannelTypes(0) // Text channel
        )
    );
  }

  async chatInputRun(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const embed = createEmbed({
          title: "❌ Permission Denied",
          description: "You need Administrator permissions to use this command.",
          color: "#ff0000",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      const guildId = interaction.guildId;
      const platform = interaction.options.getString("platform");
      const name = interaction.options.getString("name").trim();
      const channel = interaction.options.getChannel("channel");

      // Validate channel type
      if (channel.type !== 0) { // Text channel
        const embed = createEmbed({
          title: "❌ Invalid Channel",
          description: "Please select a text channel for notifications.",
          color: "#ff0000",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      // Check bot permissions in the target channel
      const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
      const permissions = channel.permissionsFor(botMember);
      
      if (!permissions.has([PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) {
        const embed = createEmbed({
          title: "❌ Missing Permissions",
          description: `I don't have permission to send messages or embed links in ${channel}. Please check my permissions.`,
          color: "#ff0000",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      const defaultStreamerData = {
        streamers: [],
      };

      const streamers = guildSettings.ensure(guildId, defaultStreamerData).streamers;

      const newStreamer = {
        id: `${platform}:${name}`,
        name,
        platform,
        channelID: channel.id,
        isLive: false,
        lastLiveAt: null,
        addedBy: interaction.user.id,
        addedAt: new Date(),
      };

      if (streamers.some((s) => s.id === newStreamer.id)) {
        const embed = createEmbed({
          title: "❌ Already Tracking",
          description: `**${name}** on **${platform}** is already being tracked.`,
          color: "#ff9900",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      streamers.push(newStreamer);
      guildSettings.set(guildId, { streamers });

      const embed = createEmbed({
        title: "✅ Streamer Added",
        description: `Successfully added **${name}** on **${platform}** to the tracking list.`,
        fields: [
          {
            name: "Platform",
            value: platform,
            inline: true,
          },
          {
            name: "Notification Channel",
            value: `${channel}`,
            inline: true,
          },
          {
            name: "Added By",
            value: `${interaction.user}`,
            inline: true,
          }
        ],
        color: "#00ff00",
        timestamp: true,
      });
      
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Error in addstreamer command:", error);
      
      const errorEmbed = createEmbed({
        title: "❌ Error",
        description: "An error occurred while adding the streamer. Please try again.",
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

module.exports = AddStreamerCommand;
