// src/utils/rumble.js
let fetch;

(async () => {
  try {
    fetch = (await import("node-fetch")).default;
  } catch (error) {
    console.error("Failed to import node-fetch:", error);
  }
})();

/**
 * Check if a Rumble streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The Rumble username
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkRumbleLive(streamer) {
  try {
    if (!fetch) {
      throw new Error("node-fetch not available");
    }

    console.log(`Checking Rumble live status for ${streamer.name}...`);
    console.log(`Fetching data from https://rumble.com/user/${streamer.name}...`);

    const response = await fetch(`https://rumble.com/user/${streamer.name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Successfully loaded URL: https://rumble.com/user/${streamer.name}`);
    const sourceCode = await response.text();
    console.log(`Rumble page loaded for ${streamer.name}, analyzing content...`);
    
    const isLive = sourceCode.includes('data-value="LIVE"') || sourceCode.includes('"isLive":true');
    console.log(`Rumble live status for ${streamer.name}: ${isLive ? 'LIVE' : 'NOT LIVE'}`);

    const updatedStreamer = {
      ...streamer,
      platform: "rumble",
      url: `https://rumble.com/c/${streamer.name}`,
      username: streamer.name,
    };

    if (isLive) {
      try {
        const titleMatch = sourceCode.match(/<h3 class=["']video-item--title["']?>(.*?)<\/h3>/i);
        const imageUrlMatch = sourceCode.match(/<img class=["']video-item--img["']?[^>]*src=["']?([^"'\s>]+)["']?[^>]*>/i);
        const viewerCountMatch = sourceCode.match(/<span class=["']video-item--watching["']?>([\d.]+[KMB]? watching)<\/span>/i);
        const profileImageUrlMatch = sourceCode.match(/<img class=["']listing-header--thumb["']?[^>]*src=["']?([^"'\s>]+)["']?[^>]*>/i);
        const followersCountMatch = sourceCode.match(
          /<span class=["']channel-header--followers["']?>([\d.,]+[KMB]?) Followers<\/span>/i
        );

        const startedAtMatch = sourceCode.match(/<time class=["']video-item--meta video-item--time["']? datetime=["']?([^"'\s>]+)["']?/i);

        // Try to extract game/category
        const gameMatch = sourceCode.match(/<span class=["']video-item--category["']?>(.*?)<\/span>/i) ||
                         sourceCode.match(/data-category=["']([^"']+)["']/i) ||
                         sourceCode.match(/<div class=["']video-item--category["']?[^>]*>(.*?)<\/div>/i);

        updatedStreamer.title = titleMatch ? titleMatch[1].trim() : "Live Stream";
        
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
        
        updatedStreamer.imageUrl = thumbnailUrl;
        updatedStreamer.profileImageUrl = profileImageUrlMatch ? profileImageUrlMatch[1] : null;
        updatedStreamer.verified = sourceCode.includes('channel-header--verified verification-badge-icon');
        updatedStreamer.bio = null; // Rumble doesn't easily expose bio in this scraping method
        updatedStreamer.game = gameMatch ? gameMatch[1].trim().replace(/<[^>]*>/g, '') : null; // Remove any HTML tags

        // Parse viewer count
        if (viewerCountMatch) {
          const viewerText = viewerCountMatch[1].replace(' watching', '');
          updatedStreamer.viewers = convertToNumber(viewerText);
        }

        // Parse follower count
        if (followersCountMatch) {
          updatedStreamer.followersCount = convertToNumber(followersCountMatch[1]);
        }

        // Parse start time
        if (startedAtMatch && startedAtMatch[1]) {
          try {
            const startedAtDate = new Date(startedAtMatch[1]);
            if (!isNaN(startedAtDate.getTime())) {
              updatedStreamer.startedAt = startedAtDate.toISOString();
            }
          } catch (dateError) {
            console.warn(`Failed to parse start date for ${streamer.name}:`, dateError);
            updatedStreamer.startedAt = null;
          }
        }

        console.log(`Rumble API response for ${streamer.name}: {
  hasData: true,
  isLive: true,
  title: "${updatedStreamer.title}",
  viewers: ${updatedStreamer.viewers || null},
  game: "${updatedStreamer.game || 'Unknown'}",
  thumbnail: "${thumbnailUrl || 'None'}"
}`);

      } catch (parseError) {
        console.warn(`Warning: Failed to parse additional Rumble data for ${streamer.name}:`, parseError);
        updatedStreamer.title = "Live Stream";
      }
    }

    if (!isLive) {
      console.log(`${streamer.name} is not live on Rumble`);
    }

    return { isLive, streamer: updatedStreamer };
  } catch (error) {
    console.error(`Error checking Rumble live status for ${streamer.name}:`, error);
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "rumble",
        url: `https://rumble.com/c/${streamer.name}`,
        error: error.message,
      }
    };
  }
}

/**
 * Convert follower/viewer count string to number
 * @param {string} countString - Count string (e.g., "1.2K", "500M")
 * @returns {number} - Parsed count
 */
function convertToNumber(countString) {
  try {
    let numberMultiplier = 1;

    if (countString.includes('K')) {
      numberMultiplier = 1e3;
    } else if (countString.includes('M')) {
      numberMultiplier = 1e6;
    } else if (countString.includes('B')) {
      numberMultiplier = 1e9;
    }

    const numStr = countString.replace(/[KMB,]/g, '');
    return Math.floor(parseFloat(numStr) * numberMultiplier);
  } catch (error) {
    console.warn("Failed to parse count:", countString, error);
    return null;
  }
}

module.exports = {
  checkRumbleLive,
};