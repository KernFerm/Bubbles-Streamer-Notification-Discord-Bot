// src/utils/tiktok.js
const { TikTokLiveConnector } = require("tiktok-live-connector");

/**
 * Check if a TikTok streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The TikTok username
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkTikTokLive(streamer) {
  let tiktokLiveConnector;
  
  try {
    console.log(`Checking TikTok live status for ${streamer.name}...`);
    console.log(`Connecting to TikTok Live API for @${streamer.name}...`);

    tiktokLiveConnector = new TikTokLiveConnector(streamer.name, {
      enableExtendedGiftInfo: false,
      requestOptions: {
        timeout: 10000,
      },
    });

    // Try to get room info to check if live
    const roomInfo = await tiktokLiveConnector.getRoomInfo();
    console.log(`TikTok API connected for ${streamer.name}, analyzing room status...`);
    
    const isLive = roomInfo && roomInfo.status === 2; // Status 2 means live
    console.log(`TikTok live status for ${streamer.name}: ${isLive ? 'LIVE' : 'NOT LIVE'} (status: ${roomInfo?.status || 'unknown'})`);
    
    if (isLive) {
      // Process thumbnail URL - handle both string and object formats
      let thumbnailUrl = null;
      const coverImage = roomInfo.cover?.url_list?.[0];
      if (coverImage) {
        if (typeof coverImage === 'string') {
          thumbnailUrl = coverImage;
        } else if (typeof coverImage === 'object' && coverImage.url) {
          thumbnailUrl = coverImage.url;
        }
      }

      // Process hashtags/game info
      const gameInfo = roomInfo.hashtag_list && roomInfo.hashtag_list.length > 0 
        ? roomInfo.hashtag_list.slice(0, 3).map(tag => `#${tag.hashtag_name}`).join(' ')
        : (roomInfo.room_id ? "Live Stream" : null);

      console.log(`TikTok API response for ${streamer.name}: {
  hasData: true,
  isLive: true,
  title: "${roomInfo.title || "Live Stream"}",
  viewers: ${roomInfo.user_count || null},
  game: "${gameInfo || 'Unknown'}",
  thumbnail: "${thumbnailUrl || 'None'}"
}`);

      const result = {
        isLive: true,
        streamer: {
          ...streamer,
          platform: "tiktok",
          username: streamer.name,
          title: roomInfo.title || "Live Stream",
          viewers: roomInfo.user_count || null,
          imageUrl: thumbnailUrl,
          bio: roomInfo.owner?.signature || null,
          followersCount: roomInfo.owner?.follower_count || null,
          verified: roomInfo.owner?.verified || false,
          url: `https://www.tiktok.com/@${streamer.name}/live`,
          startedAt: roomInfo.create_time ? new Date(roomInfo.create_time * 1000).toISOString() : null,
          game: gameInfo,
        },
      };

      return result;
    }

    console.log(`${streamer.name} is not live on TikTok`);
    return { 
      isLive: false,
      streamer: {
        ...streamer,
        platform: "tiktok",
        url: `https://www.tiktok.com/@${streamer.name}`,
      }
    };
  } catch (error) {
    console.error(`Error checking TikTok live status for ${streamer.name}:`, error);
    return { 
      isLive: false,
      streamer: {
        ...streamer,
        platform: "tiktok",
        url: `https://www.tiktok.com/@${streamer.name}`,
        error: error.message,
      }
    };
  } finally {
    // Clean up connection
    if (tiktokLiveConnector) {
      try {
        tiktokLiveConnector.disconnect();
      } catch (disconnectError) {
        console.warn("Failed to disconnect TikTok connector:", disconnectError);
      }
    }
  }
}

module.exports = {
  checkTikTokLive,
};
