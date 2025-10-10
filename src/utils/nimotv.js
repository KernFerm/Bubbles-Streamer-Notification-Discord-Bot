// src/utils/nimotv.js
const { constructSafeUrl } = require('./urlSanitizer');

let fetch;

(async () => {
  try {
    fetch = (await import("node-fetch")).default;
  } catch (error) {
    console.error("Failed to import node-fetch:", error);
  }
})();

/**
 * Check if a NimoTV streamer is live
 * @param {Object} streamer - The streamer object
 * @param {string} streamer.name - The NimoTV username
 * @returns {Promise<Object>} - Live status and streamer data
 */
async function checkNimoTVLive(streamer) {
  try {
    if (!fetch) {
      throw new Error("node-fetch not available");
    }

    console.log(`Checking NimoTV live status for ${streamer.name}...`);
    
    // Construct safe URL
    const safeUrl = constructSafeUrl('nimotv', streamer.name);
    console.log(`Fetching data from ${safeUrl}...`);

    const response = await fetch(safeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`Successfully loaded URL: ${safeUrl}`);
    const sourceCode = await response.text();
    console.log(`NimoTV page loaded for ${streamer.name}, analyzing content...`);

    // NimoTV live detection patterns
    const isLive = sourceCode.includes('"isLive":true') || 
                  sourceCode.includes('"status":"live"') ||
                  sourceCode.includes('class="live-status"') ||
                  sourceCode.includes('data-live="true"') ||
                  sourceCode.includes('"streamStatus":1');

    console.log(`NimoTV live status for ${streamer.name}: ${isLive ? 'LIVE' : 'NOT LIVE'}`);

    const updatedStreamer = {
      ...streamer,
      platform: "nimotv",
      url: safeUrl,
      username: streamer.name,
    };

    if (isLive) {
      try {
        // Extract stream title
        const titleMatch = sourceCode.match(/"title":"([^"]+)"/) ||
                          sourceCode.match(/<title>([^<]+)<\/title>/) ||
                          sourceCode.match(/"streamTitle":"([^"]+)"/) ||
                          sourceCode.match(/class="stream-title"[^>]*>([^<]+)</);

        // Extract thumbnail/preview image
        const imageUrlMatch = sourceCode.match(/"preview":"([^"]+)"/) ||
                             sourceCode.match(/"thumbnail":"([^"]+)"/) ||
                             sourceCode.match(/"cover":"([^"]+)"/) ||
                             sourceCode.match(/og:image[^>]*content="([^"]+)"/) ||
                             sourceCode.match(/"streamCover":"([^"]+)"/);

        // Extract viewer count
        const viewerCountMatch = sourceCode.match(/"viewers?":(\d+)/) ||
                               sourceCode.match(/"viewerCount":(\d+)/) ||
                               sourceCode.match(/"onlineCount":(\d+)/) ||
                               sourceCode.match(/viewers?[^>]*>(\d+)</i) ||
                               sourceCode.match(/"audienceCount":(\d+)/);

        // Extract follower count
        const followersCountMatch = sourceCode.match(/"followers?":(\d+)/) ||
                                  sourceCode.match(/"followerCount":(\d+)/) ||
                                  sourceCode.match(/"fansCount":(\d+)/) ||
                                  sourceCode.match(/followers?[^>]*>(\d+)</i);

        // Extract game/category
        const gameMatch = sourceCode.match(/"category":"([^"]+)"/) ||
                         sourceCode.match(/"game":"([^"]+)"/) ||
                         sourceCode.match(/"gameTitle":"([^"]+)"/) ||
                         sourceCode.match(/class="game-name"[^>]*>([^<]+)</);

        // Extract profile image
        const profileImageMatch = sourceCode.match(/"avatar":"([^"]+)"/) ||
                                 sourceCode.match(/"userAvatar":"([^"]+)"/) ||
                                 sourceCode.match(/"profilePic":"([^"]+)"/);

        // Extract bio/description
        const bioMatch = sourceCode.match(/"description":"([^"]+)"/) ||
                        sourceCode.match(/"bio":"([^"]+)"/) ||
                        sourceCode.match(/class="user-bio"[^>]*>([^<]+)</);

        // Extract start time
        const startTimeMatch = sourceCode.match(/"startTime":"([^"]+)"/) ||
                              sourceCode.match(/"liveStartTime":"([^"]+)"/) ||
                              sourceCode.match(/"streamStartTime":"([^"]+)"/);

        // Process thumbnail URL - handle both string and object formats
        let thumbnailUrl = null;
        if (imageUrlMatch && imageUrlMatch[1]) {
          const rawThumbnail = imageUrlMatch[1];
          if (typeof rawThumbnail === 'string') {
            // Clean up URL if needed
            thumbnailUrl = rawThumbnail.replace(/\\"/g, '"').replace(/\\/g, '');
          } else if (typeof rawThumbnail === 'object' && rawThumbnail.url) {
            thumbnailUrl = rawThumbnail.url;
          }
        }

        updatedStreamer.title = titleMatch ? titleMatch[1].replace(/\\"/g, '"').replace(/\\/g, '').trim() : "Live Stream";
        updatedStreamer.imageUrl = thumbnailUrl;
        updatedStreamer.profileImageUrl = profileImageMatch ? profileImageMatch[1].replace(/\\"/g, '"').replace(/\\/g, '') : null;
        updatedStreamer.verified = sourceCode.includes('"verified":true') || sourceCode.includes('class="verified"');
        updatedStreamer.bio = bioMatch ? bioMatch[1].replace(/\\"/g, '"').replace(/\\/g, '').trim() : null;
        updatedStreamer.game = gameMatch ? gameMatch[1].replace(/\\"/g, '"').replace(/\\/g, '').trim() : null;

        // Parse viewer count
        if (viewerCountMatch) {
          updatedStreamer.viewers = parseInt(viewerCountMatch[1], 10);
        }

        // Parse follower count
        if (followersCountMatch) {
          updatedStreamer.followersCount = parseInt(followersCountMatch[1], 10);
        }

        // Parse start time
        if (startTimeMatch && startTimeMatch[1]) {
          try {
            const startedAtDate = new Date(startTimeMatch[1]);
            if (!isNaN(startedAtDate.getTime())) {
              updatedStreamer.startedAt = startedAtDate.toISOString();
            }
          } catch (dateError) {
            console.warn(`Failed to parse start date for ${streamer.name}:`, dateError);
            updatedStreamer.startedAt = null;
          }
        }

        console.log(`NimoTV API response for ${streamer.name}: {
  hasData: true,
  isLive: true,
  title: "${updatedStreamer.title}",
  viewers: ${updatedStreamer.viewers || null},
  game: "${updatedStreamer.game || 'Unknown'}",
  thumbnail: "${thumbnailUrl || 'None'}"
}`);

      } catch (parseError) {
        console.warn(`Warning: Failed to parse additional NimoTV data for ${streamer.name}:`, parseError);
        updatedStreamer.title = "Live Stream";
      }
    }

    if (!isLive) {
      console.log(`${streamer.name} is not live on NimoTV`);
    }

    return { isLive, streamer: updatedStreamer };
  } catch (error) {
    console.error(`Error checking NimoTV live status for ${streamer.name}:`, error);
    
    // Use a safe fallback URL or null if sanitization failed
    let fallbackUrl = null;
    try {
      fallbackUrl = constructSafeUrl('nimotv', streamer.name);
    } catch (sanitizeError) {
      console.warn(`Failed to sanitize streamer name for fallback URL: ${sanitizeError.message}`);
    }
    
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "nimotv",
        url: fallbackUrl,
        error: error.message,
      }
    };
  }
}

module.exports = {
  checkNimoTVLive,
};