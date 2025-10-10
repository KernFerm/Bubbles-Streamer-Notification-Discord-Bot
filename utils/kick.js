// src/utils/kick.js
const { KickApiWrapper } = require("kick.com-api");

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
          imageUrl: (data.livestream.thumbnail && typeof data.livestream.thumbnail === 'object' && data.livestream.thumbnail.url) 
                   ? data.livestream.thumbnail.url 
                   : (typeof data.livestream.thumbnail === 'string' ? data.livestream.thumbnail : data.user.profile_pic || null),
          startedAt: data.livestream.start_time || null,
          url: `https://kick.com/${streamer.name}`,
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
        url: `https://kick.com/${streamer.name}`,
      }
    };
  } catch (error) {
    console.error(`Error checking Kick live status for ${streamer.name}:`, error);
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "kick",
        url: `https://kick.com/${streamer.name}`,
        error: error.message,
      }
    };
  }
}

module.exports = {
  checkKickLive,
};
