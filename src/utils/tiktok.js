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
    tiktokLiveConnector = new TikTokLiveConnector(streamer.name, {
      enableExtendedGiftInfo: false,
      requestOptions: {
        timeout: 10000,
      },
    });

    // Try to get room info to check if live
    const roomInfo = await tiktokLiveConnector.getRoomInfo();
    
    if (roomInfo && roomInfo.status === 2) { // Status 2 means live
      const result = {
        isLive: true,
        streamer: {
          ...streamer,
          platform: "tiktok",
          username: streamer.name,
          title: roomInfo.title || "Live Stream",
          viewers: roomInfo.user_count || null,
          imageUrl: roomInfo.cover?.url_list?.[0] || null,
          bio: roomInfo.owner?.signature || null,
          followersCount: roomInfo.owner?.follower_count || null,
          verified: roomInfo.owner?.verified || false,
          url: `https://www.tiktok.com/@${streamer.name}/live`,
          startedAt: roomInfo.create_time ? new Date(roomInfo.create_time * 1000).toISOString() : null,
        },
      };

      return result;
    }

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
