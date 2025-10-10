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

    // Try multiple approaches to get stream data
    let streamData = null;
    
    // Method 1: Try Twitch's public API endpoint (no auth required for basic data)
    try {
      const apiResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamer.name}`, {
        headers: {
          'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko', // Public Twitch client ID
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        if (apiData.data && apiData.data.length > 0) {
          streamData = apiData.data[0];
          console.log(`Found API data for ${streamer.name}:`, {
            title: streamData.title,
            game: streamData.game_name,
            viewers: streamData.viewer_count,
            thumbnail: streamData.thumbnail_url
          });
        }
      }
    } catch (apiError) {
      console.log(`API method failed for ${streamer.name}:`, apiError.message);
    }

    // Method 2: Try the GraphQL endpoint (fallback)
    if (!streamData) {
      try {
        const gqlResponse = await fetch('https://gql.twitch.tv/gql', {
          method: 'POST',
          headers: {
            'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify([{
            "operationName": "StreamMetadata",
            "variables": {
              "channelLogin": streamer.name
            },
            "query": `query StreamMetadata($channelLogin: String!) {
              user(login: $channelLogin) {
                id
                displayName
                followers {
                  totalCount
                }
                stream {
                  id
                  title
                  game {
                    displayName
                  }
                  viewersCount
                  createdAt
                  previewImageURL(width: 1920, height: 1080)
                }
              }
            }`
          }]),
          timeout: 10000
        });

        if (gqlResponse.ok) {
          const gqlData = await gqlResponse.json();
          if (gqlData[0] && gqlData[0].data && gqlData[0].data.user && gqlData[0].data.user.stream) {
            const userData = gqlData[0].data.user;
            streamData = {
              title: userData.stream.title,
              game_name: userData.stream.game ? userData.stream.game.displayName : null,
              viewer_count: userData.stream.viewersCount,
              started_at: userData.stream.createdAt,
              user_name: userData.displayName,
              follower_count: userData.followers ? userData.followers.totalCount : null,
              thumbnail_url: userData.stream.previewImageURL || null
            };
            console.log(`Found GraphQL data for ${streamer.name}:`, {
              title: streamData.title,
              game: streamData.game_name,
              viewers: streamData.viewer_count,
              thumbnail: streamData.thumbnail_url
            });
          }
        }
      } catch (gqlError) {
        console.log(`GraphQL method failed for ${streamer.name}:`, gqlError.message);
      }
    }

    // Method 3: Fallback to web scraping (original method)
    if (!streamData) {
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

      if (!isLive) {
        return { 
          isLive: false, 
          streamer: {
            ...streamer,
            platform: "twitch",
            url: `https://twitch.tv/${streamer.name}`,
          }
        };
      }

      // Try to extract basic data from HTML as fallback
      const titleMatch = sourceCode.match(/<title>([^<]+)<\/title>/);
      streamData = {
        title: titleMatch ? titleMatch[1].replace(' - Twitch', '').trim() : 'Live Stream',
        viewer_count: null,
        game_name: null,
        started_at: null
      };
      console.log(`Using HTML fallback for ${streamer.name}, title: ${streamData.title}`);
    }

    // If we have stream data, the streamer is live
    if (streamData) {
      // Process thumbnail URL - Twitch thumbnails need {width}x{height} replaced with actual dimensions
      let thumbnailUrl = null;
      if (streamData.thumbnail_url) {
        if (typeof streamData.thumbnail_url === 'string') {
          // Replace Twitch thumbnail template with actual dimensions
          thumbnailUrl = streamData.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080');
        } else if (typeof streamData.thumbnail_url === 'object' && streamData.thumbnail_url.url) {
          thumbnailUrl = streamData.thumbnail_url.url;
        }
      }

      const updatedStreamer = {
        ...streamer,
        platform: "twitch",
        url: `https://twitch.tv/${streamer.name}`,
        username: streamer.name,
        title: streamData.title || "Live Stream",
        viewers: streamData.viewer_count || null,
        game: streamData.game_name || null,
        startedAt: streamData.started_at || null,
        followersCount: streamData.follower_count || null,
        imageUrl: thumbnailUrl,
      };

      return { isLive: true, streamer: updatedStreamer };
    }

    // Not live
    return { 
      isLive: false, 
      streamer: {
        ...streamer,
        platform: "twitch",
        url: `https://twitch.tv/${streamer.name}`,
      }
    };

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
