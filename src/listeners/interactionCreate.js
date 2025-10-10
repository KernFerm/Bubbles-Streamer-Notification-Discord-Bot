// src/listeners/interactionCreate.js
const { Listener } = require("@sapphire/framework");
const config = require("../../config.json");
const { createEmbed } = require("../utils/embed");

class InteractionCreateListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "interactionCreate",
      event: "interactionCreate",
    });
  }

  async run(interaction) {
    try {
      // Handle different types of interactions
      if (interaction.isCommand()) {
        // Slash commands are handled by Sapphire framework automatically
        return;
      }
      
      if (interaction.isButton()) {
        // Handle button interactions
        await this.handleButtonInteraction(interaction);
        return;
      }
      
      if (interaction.isStringSelectMenu()) {
        // Handle select menu interactions
        await this.handleSelectMenuInteraction(interaction);
        return;
      }
      
      if (interaction.isModalSubmit()) {
        // Handle modal submissions
        await this.handleModalSubmit(interaction);
        return;
      }
      
    } catch (error) {
      console.error("An error occurred in interactionCreate listener:", error);
      
      const errorEmbed = createEmbed({
        title: "Error",
        description: "An error occurred while processing your interaction. Please try again later.",
        color: "#ff0000",
      });
      
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
          await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      } catch (replyError) {
        console.error("Failed to send error message:", replyError);
      }
    }
  }
  
  async handleButtonInteraction(interaction) {
    // Handle confirm buttons from confirm utility
    if (interaction.customId === "confirm_yes" || interaction.customId === "confirm_no") {
      // These are handled by the confirm utility
      return;
    }
    
    // Add other button handlers here as needed
    console.log(`Unhandled button interaction: ${interaction.customId}`);
  }
  
  async handleSelectMenuInteraction(interaction) {
    // Handle help select menu
    if (interaction.customId === "help-select") {
      // This is handled by the help command
      return;
    }
    
    // Add other select menu handlers here as needed
    console.log(`Unhandled select menu interaction: ${interaction.customId}`);
  }
  
  async handleModalSubmit(interaction) {
    // Add modal submission handlers here as needed
    console.log(`Unhandled modal submission: ${interaction.customId}`);
  }
}

module.exports = InteractionCreateListener;
