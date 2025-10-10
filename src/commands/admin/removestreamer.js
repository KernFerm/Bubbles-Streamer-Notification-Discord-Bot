// src/commands/admin/removestreamer.js
const { Command } = require("@sapphire/framework");
const { PermissionFlagsBits } = require("discord.js");
const { guildSettings } = require("../../../db");
const { createEmbed } = require("../../utils/embed");
const confirm = require("../../utils/confirm");

class RemoveStreamerCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "removestreamer",
      description: "Remove a streamer from tracking.",
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
            .setName("name")
            .setDescription("The name of the streamer to remove")
            .setRequired(true)
            .setAutocomplete(true)
        )
    );
  }

  async autocompleteRun(interaction) {
    try {
      const guildId = interaction.guildId;
      const streamers = guildSettings.get(guildId, "streamers", []);
      const focusedValue = interaction.options.getFocused().toLowerCase();

      const filtered = streamers
        .filter(streamer => 
          streamer.name.toLowerCase().includes(focusedValue) ||
          streamer.platform.toLowerCase().includes(focusedValue)
        )
        .slice(0, 25) // Discord limit
        .map(streamer => ({
          name: `${streamer.name} (${streamer.platform})`,
          value: streamer.name,
        }));

      await interaction.respond(filtered);
    } catch (error) {
      console.error("Error in removestreamer autocomplete:", error);
      await interaction.respond([]);
    }
  }

  async chatInputRun(interaction) {
    try {
      await interaction.deferReply({ flags: 64 }); // 64 = MessageFlags.Ephemeral

      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        const embed = createEmbed({
          title: "❌ Permission Denied",
          description: "You need Manage Channels permissions to use this command.",
          color: "#ff0000",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      const guildId = interaction.guildId;
      const name = interaction.options.getString("name").trim();
      const streamers = guildSettings.get(guildId, "streamers", []);

      const streamerIndex = streamers.findIndex(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );

      if (streamerIndex === -1) {
        const embed = createEmbed({
          title: "❌ Streamer Not Found",
          description: `**${name}** was not found in the tracking list.`,
          fields: streamers.length > 0 ? [
            {
              name: "Currently Tracked Streamers",
              value: streamers.map(s => `• **${s.name}** (${s.platform})`).join('\n').substring(0, 1024),
              inline: false,
            }
          ] : [
            {
              name: "No Streamers",
              value: "There are no streamers currently being tracked.",
              inline: false,
            }
          ],
          color: "#ff9900",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      const streamerToRemove = streamers[streamerIndex];

      // Ask for confirmation
      const confirmed = await confirm(
        interaction,
        `Are you sure you want to remove **${streamerToRemove.name}** from **${streamerToRemove.platform}** tracking?`
      );

      if (!confirmed) {
        const embed = createEmbed({
          title: "❌ Cancelled",
          description: "Streamer removal cancelled.",
          color: "#ff9900",
        });
        return interaction.followUp({ embeds: [embed] });
      }

      streamers.splice(streamerIndex, 1);
      guildSettings.set(guildId, "streamers", streamers);

      const embed = createEmbed({
        title: "✅ Streamer Removed",
        description: `Successfully removed **${streamerToRemove.name}** from **${streamerToRemove.platform}** tracking.`,
        fields: [
          {
            name: "Platform",
            value: streamerToRemove.platform,
            inline: true,
          },
          {
            name: "Previous Channel",
            value: `<#${streamerToRemove.channelID}>`,
            inline: true,
          },
          {
            name: "Removed By",
            value: `${interaction.user}`,
            inline: true,
          }
        ],
        color: "#00ff00",
        timestamp: true,
      });
      
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error("Error in removestreamer command:", error);
      
      const errorEmbed = createEmbed({
        title: "❌ Error",
        description: "An error occurred while removing the streamer. Please try again.",
        color: "#ff0000",
      });
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
      }
    }
  }
}

module.exports = RemoveStreamerCommand;
