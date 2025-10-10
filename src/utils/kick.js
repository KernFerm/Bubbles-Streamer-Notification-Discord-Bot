// src/utils/kick.js
const { constructSafeUrl } = require('./urlSanitizer');
const kick = require('kick.com-api');

/**
 * Check if a Kick streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The Kick username
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkKickLive(streamer) {
  let kickApi;
  
  try {
    console.log(`Checking Kick live status for ${streamer.name}...`);
    
    // Construct safe URL
    const safeUrl = constructSafeUrl('kick', streamer.name);
    
    kickApi = new KickApiWrapper();
    const data = await kickApi.fetchChannelData(streamer.name);
    
    console.log(`Kick API response for ${streamer.name}:`, {
      hasData: !!data,
      hasLivestream: !!(data && data.livestream),
      isLive: !!(data && data.livestream && data.livestream.is_live),
      title: data && data.livestream ? data.livestream.session_title : 'No livestream',
      viewers: data && data.livestream ? data.livestream.viewer_count : 'N/A'
    });

    if (data && data.livestream && data.livestream.is_live) {
      // Clean bio by removing 7TV emoticons and other noise
      const cleanedBio = data.user.bio 
        ? data.user.bio.replace(/\[7TV:[^\]]+\]/g, "").trim()
        : null;

      const result = {
        isLive: true,
        streamer: {
          ...streamer,
          platform: "kick",
          username: data.user.username || streamer.name,
          bio: cleanedBio,
          followersCount: data.followers_count || null,
          profileImageUrl: data.user.profile_pic || null,
          verified: data.verified || false,
          title: data.livestream.session_title || "Live Stream",
          viewers: data.livestream.viewer_count || null,
          imageUrl: data.livestream.thumbnail || null,
          startedAt: data.livestream.created_at || null,
          url: safeUrl,
          game: data.livestream.categories && data.livestream.categories.length > 0 
                ? data.livestream.categories[0].name 
                : (data.recent_categories && data.recent_categories.length > 0 
                   ? data.recent_categories[0].name 
                   : null),
        },
      };

      return result;
    }

    console.log(`${streamer.name} is not live on Kick`);
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "kick",
        url: safeUrl,
      }
    };
  } catch (error) {
    console.error(`Error checking Kick live status for ${streamer.name}:`, error);
    
    // Use a safe fallback URL or null if sanitization failed
    let fallbackUrl = null;
    try {
      fallbackUrl = constructSafeUrl('kick', streamer.name);
    } catch (sanitizeError) {
      console.warn(`Failed to sanitize streamer name for fallback URL: ${sanitizeError.message}`);
    }
    
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "kick",
        url: fallbackUrl,
        error: error.message,
      }
    };
  }
}

module.exports = {
  checkKickLive,
};
