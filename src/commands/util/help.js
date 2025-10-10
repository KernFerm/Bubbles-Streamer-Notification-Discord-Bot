// src/commands/util/help.js
const { Command } = require("@sapphire/framework");
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../../utils/embed");

class HelpCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      name: "help",
      description: "Displays information about available commands.",
    });
  }

  async registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName(this.name).setDescription(this.description)
    );
  }

  async chatInputRun(interaction) {
    try {
      const allCommands = [...this.container.stores.get("commands").values()];

      const isAdmin = interaction.member.permissions.has(PermissionFlagsBits.Administrator);
      const commands = isAdmin
        ? allCommands
        : allCommands.filter((cmd) => !cmd.name.includes("admin"));

      if (commands.length === 0) {
        const embed = createEmbed({
          title: "📚 Help Panel",
          description: "No commands available.",
          color: "#ff9900",
        });
        return interaction.reply({ embeds: [embed], flags: 64 });
      }

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("help-select")
        .setPlaceholder("Select a command for more info")
        .addOptions(
          commands.map((cmd) => ({
            label: cmd.name,
            value: cmd.name,
            description: cmd.description?.substring(0, 100) || "No description",
          }))
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      const embed = createEmbed({
        title: "📚 Help Panel",
        description: "Select a command from the dropdown for more information.",
        fields: [
          {
            name: "Available Commands",
            value: commands.map(cmd => `\`/${cmd.name}\` - ${cmd.description}`).join('\n'),
            inline: false,
          }
        ],
      });

      const reply = await interaction.reply({
        embeds: [embed],
        components: [row],
        flags: 64, // MessageFlags.Ephemeral
        withResponse: true,
      });

      const filter = (i) => i.customId === "help-select" && i.user.id === interaction.user.id;

      const collector = reply.createMessageComponentCollector({
        filter,
        componentType: ComponentType.StringSelect,
        time: 60000,
      });

      collector.on("collect", async (menuInteraction) => {
        try {
          const selectedCommandName = menuInteraction.values[0];
          const selectedCommand = commands.find(
            (cmd) => cmd.name === selectedCommandName
          );

          if (selectedCommand) {
            const updatedEmbed = createEmbed({
              title: `📚 Command: ${selectedCommand.name}`,
              description: selectedCommand.description || "No description available",
              fields: [
                {
                  name: "Usage",
                  value: `\`/${selectedCommand.name}\``,
                  inline: true,
                },
                {
                  name: "Category",
                  value: selectedCommand.category || "General",
                  inline: true,
                }
              ],
            });

            await menuInteraction.update({
              embeds: [updatedEmbed],
              components: [row],
            });
          }
        } catch (error) {
          console.error("Error handling help menu interaction:", error);
        }
      });

      collector.on("end", () => {
        try {
          interaction.editReply({
            components: [],
          });
        } catch (error) {
          console.error("Error removing components:", error);
        }
      });
    } catch (error) {
      console.error("Error in help command:", error);
      const errorEmbed = createEmbed({
        title: "Error",
        description: "An error occurred while displaying help information.",
        color: "#ff0000",
      });
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errorEmbed], flags: 64 });
      } else {
        await interaction.reply({ embeds: [errorEmbed], flags: 64 });
      }
    }
  }
}

module.exports = HelpCommand;
