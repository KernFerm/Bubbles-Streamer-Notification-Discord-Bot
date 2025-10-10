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

    console.log(`Checking YouTube live status for ${streamer.name}...`);
    console.log(`Fetching data from https://www.youtube.com/@${streamer.name}...`);

    const response = await fetch(`https://www.youtube.com/@${streamer.name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Successfully loaded URL: https://www.youtube.com/@${streamer.name}`);
    const sourceCode = await response.text();
    console.log(`YouTube page loaded for ${streamer.name}, analyzing content...`);
    
    const isLive = sourceCode.includes('"text":"LIVE"') || sourceCode.includes('"isLiveContent":true');
    console.log(`YouTube live status for ${streamer.name}: ${isLive ? 'LIVE' : 'NOT LIVE'}`);

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

      // Try to extract game/category
      const gameMatch = sourceCode.match(/"category":"([^"]+)"/) ||
                       sourceCode.match(/"gameName":"([^"]+)"/) ||
                       sourceCode.match(/"gameTitle":"([^"]+)"/);

      // Process thumbnail URL - handle both string and object formats
      let thumbnailUrl = null;
      if (imageUrlMatch && imageUrlMatch[1]) {
        const rawThumbnail = imageUrlMatch[1];
        if (typeof rawThumbnail === 'string') {
          thumbnailUrl = rawThumbnail;
        } else if (typeof rawThumbnail === 'object' && rawThumbnail.url) {
          thumbnailUrl = rawThumbnail.url;
        }
      }

      console.log(`YouTube API response for ${streamer.name}: {
  hasData: true,
  isLive: true,
  title: "${titleMatch ? titleMatch[1] : "Live Stream"}",
  viewers: ${viewCountMatch ? parseInt(viewCountMatch[1].replace(/,/g, ""), 10) : null},
  game: "${gameMatch ? gameMatch[1] : 'Unknown'}",
  thumbnail: "${thumbnailUrl || 'None'}"
}`);

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
          imageUrl: thumbnailUrl,
          startedAt: null,
          url: `https://www.youtube.com/@${streamer.name}`,
          game: gameMatch ? gameMatch[1] : null,
        },
      };

      return result;
    }

    console.log(`${streamer.name} is not live on YouTube`);
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
