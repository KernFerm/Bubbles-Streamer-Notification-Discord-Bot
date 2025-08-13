// src/utils/twitch.js
let fetch;

(async () => {
  try {
    fetch = (await import("node-fetch")).default;
  } catch (error) {
    console.error("Failed to import node-fetch:", error);
  }
})();

/**
 * Check if a Twitch streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The Twitch username
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkTwitchLive(streamer) {
  try {
    if (!fetch) {
      throw new Error("node-fetch not available");
    }

    const response = await fetch(`https://twitch.tv/${streamer.name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const sourceCode = await response.text();
    const isLive = sourceCode.includes('"isLiveBroadcast":true');

    const updatedStreamer = {
      ...streamer,
      platform: "twitch",
      url: `https://twitch.tv/${streamer.name}`,
      username: streamer.name,
    };

    if (isLive) {
      try {
        const jsonLdMatch = sourceCode.match(
          /<script type="application\/ld\+json">(\[.*?\])<\/script>/s
        );
        
        if (jsonLdMatch && jsonLdMatch[1]) {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          const liveData = jsonLd.find((data) => data["@type"] === "VideoObject");

          if (liveData) {
            updatedStreamer.title = liveData.name || "Live Stream";
            updatedStreamer.description = liveData.description || "";
            
            // Handle thumbnail URLs
            if (liveData.thumbnailUrl && Array.isArray(liveData.thumbnailUrl)) {
              updatedStreamer.imageUrl = liveData.thumbnailUrl[2] || liveData.thumbnailUrl[0];
            } else if (liveData.thumbnailUrl) {
              updatedStreamer.imageUrl = liveData.thumbnailUrl;
            }
            
            // Handle start date
            if (liveData.publication && liveData.publication.startDate) {
              updatedStreamer.startedAt = liveData.publication.startDate;
            }
          }
        }

        // Try to extract viewer count
        const viewerMatch = sourceCode.match(/"viewersCount":(\d+)/);
        if (viewerMatch) {
          updatedStreamer.viewers = parseInt(viewerMatch[1], 10);
        }

        // Try to extract follower count
        const followerMatch = sourceCode.match(/"followersCount":(\d+)/);
        if (followerMatch) {
          updatedStreamer.followersCount = parseInt(followerMatch[1], 10);
        }

      } catch (parseError) {
        console.warn(`Warning: Failed to parse additional Twitch data for ${streamer.name}:`, parseError);
        // Set basic live data even if parsing fails
        updatedStreamer.title = "Live Stream";
      }
    }

    return { isLive, streamer: updatedStreamer };
  } catch (error) {
    console.error(`Error checking Twitch live status for ${streamer.name}:`, error);
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "twitch",
        url: `https://twitch.tv/${streamer.name}`,
        error: error.message,
      }
    };
  }
}

module.exports = {
  checkTwitchLive,
};
