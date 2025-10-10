// src/utils/confirm.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const confirm = async (interaction, prompt) => {
  try {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("confirm_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("confirm_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.followUp({ content: prompt, components: [row] });

    const filter = (i) => {
      try {
        i.deferUpdate();
        return i.customId === "confirm_yes" || i.customId === "confirm_no";
      } catch (error) {
        console.error("Error in confirm filter:", error);
        return false;
      }
    };

    return new Promise((resolve) => {
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
        max: 1,
      });

      collector.on("collect", (i) => {
        resolve(i.customId === "confirm_yes");
        collector.stop();
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time" || collected.size === 0) {
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("Error in confirm utility:", error);
    return false;
  }
};

module.exports = confirm;
