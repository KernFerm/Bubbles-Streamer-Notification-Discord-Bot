// src/commands/util/ping.js
const { Command } = require("@sapphire/framework");
const { createEmbed } = require("../../utils/embed");

class PingCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "ping",
      description: "Measure the bot's response time in milliseconds.",
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
      const msg = await interaction.reply({
        content: "🏓 Pinging...",
        fetchReply: true,
      });
      
      const latency = msg.createdTimestamp - interaction.createdTimestamp;
      const apiLatency = Math.round(this.container.client.ws.ping);
      
      const embed = createEmbed({
        title: "🏓 Pong!",
        fields: [
          {
            name: "Bot Latency",
            value: `${latency}ms`,
            inline: true,
          },
          {
            name: "API Latency",
            value: `${apiLatency}ms`,
            inline: true,
          },
          {
            name: "Status",
            value: latency < 100 ? "🟢 Excellent" : latency < 200 ? "🟡 Good" : "🔴 Poor",
            inline: true,
          }
        ],
        color: latency < 100 ? "#00ff00" : latency < 200 ? "#ffff00" : "#ff0000",
        timestamp: true,
      });
      
      await interaction.editReply({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("Error in ping command:", error);
      
      const errorEmbed = createEmbed({
        title: "Error",
        description: "Failed to measure ping.",
        color: "#ff0000",
      });
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
}

module.exports = PingCommand;
