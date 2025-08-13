// src/utils/youtube.js
let fetch;

(async () => {
  try {
    fetch = (await import("node-fetch")).default;
  } catch (error) {
    console.error("Failed to import node-fetch:", error);
  }
})();

/**
 * Check if a YouTube streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The YouTube channel name
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkYouTubeLive(streamer) {
  try {
    if (!fetch) {
      throw new Error("node-fetch not available");
    }

    const response = await fetch(`https://www.youtube.com/@${streamer.name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const sourceCode = await response.text();
    const isLive = sourceCode.includes('"text":"LIVE"') || sourceCode.includes('"isLiveContent":true');

    if (isLive) {
      const titleMatch = sourceCode.match(/"label":"([^"]+) by/) || 
                        sourceCode.match(/"title":{"runs":\[{"text":"([^"]+)"/);
      
      const imageUrlRegex = /"url":"(https:\/\/i\.ytimg\.com\/[^"]+)",(?:[^}]*"width":336)/;
      const imageUrlMatch = sourceCode.match(imageUrlRegex);
      
      const viewCountMatch = sourceCode.match(
        /"viewCountText":\{"runs":\[\{"text":"([\d,]+)"\},\{"text":" watching"\}\]\}/
      ) || sourceCode.match(/"viewCount":"(\d+)"/);
      
      const descriptionMatch = sourceCode.match(
        /"descriptionSnippet":\s*\{"runs":\s*\[\{"text":"([^"]+)"\}\]\}/
      );
      
      const subscribersMatch = sourceCode.match(
        /"subscriberCountText":\s*\{"simpleText":"([\d\.KM]+) subscribers"\}/
      );

      const result = {
        isLive: true,
        streamer: {
          ...streamer,
          platform: "youtube",
          username: streamer.name,
          bio: descriptionMatch ? descriptionMatch[1].replace(/\\n/g, "\n") : null,
          followersCount: subscribersMatch ? parseSubscribersCount(subscribersMatch[1]) : null,
          profileImageUrl: null,
          verified: sourceCode.includes('"isVerified":true'),
          title: titleMatch ? titleMatch[1] : "Live Stream",
          viewers: viewCountMatch ? parseInt(viewCountMatch[1].replace(/,/g, ""), 10) : null,
          imageUrl: imageUrlMatch ? imageUrlMatch[1] : null,
          startedAt: null,
          url: `https://www.youtube.com/@${streamer.name}`,
        },
      };

      return result;
    }

    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "youtube",
        url: `https://www.youtube.com/@${streamer.name}`,
      }
    };
  } catch (error) {
    console.error(`Error checking YouTube live status for @${streamer.name}:`, error);
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "youtube",
        url: `https://www.youtube.com/@${streamer.name}`,
        error: error.message,
      }
    };
  }
}

/**
 * Parse subscriber count string to number
 * @param {string} subscriberText - Subscriber count text (e.g., "1.2K", "500M")
 * @returns {number} - Parsed subscriber count
 */
function parseSubscribersCount(subscriberText) {
  try {
    const multiplier = subscriberText.endsWith("K") ? 1000 :
                     subscriberText.endsWith("M") ? 1000000 :
                     subscriberText.endsWith("B") ? 1000000000 : 1;
    
    const numStr = subscriberText.replace(/[KMB]/g, "");
    return Math.floor(parseFloat(numStr) * multiplier);
  } catch (error) {
    console.warn("Failed to parse subscriber count:", subscriberText, error);
    return null;
  }
}

module.exports = {
  checkYouTubeLive,
};
