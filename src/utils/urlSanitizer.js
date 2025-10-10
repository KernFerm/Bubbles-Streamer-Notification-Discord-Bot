// src/utils/urlSanitizer.js

/**
 * Sanitize and validate streamer name for URL construction
 * @param {string} name - The streamer name to sanitize
 * @param {string} platform - The platform name for context
 * @returns {string} - Sanitized streamer name
 * @throws {Error} - If name is invalid or contains dangerous characters
 */
function sanitizeStreamerName(name, platform = 'unknown') {
  if (!name || typeof name !== 'string') {
    throw new Error(`Invalid streamer name for ${platform}: must be a non-empty string`);
  }
  
  // Remove any potentially dangerous characters
  const sanitized = name.trim()
    .replace(/[<>\"'&]/g, '') // Remove HTML/script injection characters
    .replace(/[\/\\]/g, '') // Remove path traversal characters
    .replace(/[\s]+/g, '') // Remove spaces
    .substring(0, 100); // Limit length to prevent excessively long URLs
  
  if (!sanitized || sanitized.length === 0) {
    throw new Error(`Streamer name is empty after sanitization for ${platform}`);
  }
  
  // Additional validation: only allow alphanumeric, dots, underscores, and hyphens
  // This covers most legitimate usernames across platforms
  if (!/^[a-zA-Z0-9._-]+$/.test(sanitized)) {
    throw new Error(`Streamer name contains invalid characters for ${platform}: ${name}`);
  }
  
  return sanitized;
}

/**
 * Construct a safe URL for a given platform and streamer
 * @param {string} platform - The platform name
 * @param {string} streamerName - The streamer name (will be sanitized)
 * @returns {string} - Safe URL
 */
function constructSafeUrl(platform, streamerName) {
  const sanitizedName = sanitizeStreamerName(streamerName, platform);
  const encodedName = encodeURIComponent(sanitizedName);
  
  switch (platform.toLowerCase()) {
    case 'twitch':
      return `https://twitch.tv/${encodedName}`;
    case 'youtube':
      return `https://www.youtube.com/@${encodedName}`;
    case 'kick':
      return `https://kick.com/${encodedName}`;
    case 'rumble':
      return `https://rumble.com/c/${encodedName}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${encodedName}`;
    case 'nimotv':
      return `https://www.nimo.tv/${encodedName}`;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Construct a safe API URL for platforms that support it
 * @param {string} platform - The platform name
 * @param {string} streamerName - The streamer name (will be sanitized)
 * @param {string} apiEndpoint - The specific API endpoint
 * @returns {string} - Safe API URL
 */
function constructSafeApiUrl(platform, streamerName, apiEndpoint) {
  const sanitizedName = sanitizeStreamerName(streamerName, platform);
  const encodedName = encodeURIComponent(sanitizedName);
  
  switch (platform.toLowerCase()) {
    case 'twitch':
      if (apiEndpoint === 'streams') {
        return `https://api.twitch.tv/helix/streams?user_login=${encodedName}`;
      }
      break;
    case 'rumble':
      if (apiEndpoint === 'user') {
        return `https://rumble.com/user/${encodedName}`;
      }
      break;
    default:
      throw new Error(`API URL construction not supported for platform: ${platform}`);
  }
  
  throw new Error(`Unknown API endpoint '${apiEndpoint}' for platform: ${platform}`);
}

module.exports = {
  sanitizeStreamerName,
  constructSafeUrl,
  constructSafeApiUrl,
};