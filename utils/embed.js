// src/utils/embed.js
const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

/**
 * Creates a Discord embed with the specified options
 * @param {Object} options - The embed options
 * @param {string} [options.title] - The embed title
 * @param {string} [options.description] - The embed description
 * @param {string} [options.url] - The embed URL
 * @param {string} [options.color] - The embed color (hex or name)
 * @param {Array} [options.fields] - Array of field objects
 * @param {Object} [options.author] - Author object with name, icon, url
 * @param {string} [options.thumbnail] - Thumbnail URL
 * @param {string} [options.image] - Image URL
 * @param {string} [options.video] - Video URL
 * @param {boolean} [options.timestamp] - Whether to add current timestamp
 * @returns {EmbedBuilder} The created embed
 */
function createEmbed(options = {}) {
  if (!options || Object.keys(options).length === 0) {
    return new EmbedBuilder();
  }

  const embed = new EmbedBuilder();

  // Set color with fallback
  embed.setColor(options.color || config.color || "#0099ff");

  if (options.title) embed.setTitle(options.title);

  if (options.description) embed.setDescription(options.description);

  if (options.url) embed.setURL(options.url);

  if (options.fields && Array.isArray(options.fields)) {
    embed.addFields(options.fields);
  }

  if (options.author) {
    embed.setAuthor({
      name: options.author.name,
      iconURL: options.author.icon || options.author.iconURL,
      url: options.author.url,
    });
  }

  if (options.thumbnail) embed.setThumbnail(options.thumbnail);

  if (options.image) embed.setImage(options.image);

  if (options.video) embed.setVideo(options.video);

  // Set footer from config if available
  if (config.footerText || config.footerIcon) {
    embed.setFooter({
      text: config.footerText || "",
      iconURL: config.footerIcon || undefined,
    });
  }

  if (options.timestamp) {
    embed.setTimestamp(new Date());
  }

  return embed;
}

module.exports = { createEmbed };
