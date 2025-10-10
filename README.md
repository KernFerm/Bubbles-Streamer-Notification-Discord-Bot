# <div align="center">

![Version](https://img.shields.io/badge/Version-v3.0-purple.svg)
![Discord.js](https://img.shields.io/badge/Discord.js-v14.21.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)
![License](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen.svg)

# 🎮 Streamer Notification Discord Bot

### 🚀 Advanced Multi-Platform Stream Monitoring with Enhanced Features

*A powerful Discord bot that tracks live streams across 6 major platforms with advanced features like game change detection, offline notifications, and comprehensive debugging.*

</div>

## 📋 Overview

**Streamer Notification Bot** is a feature-rich Discord bot built with the Sapphire Framework that automatically monitors your favorite streamers across multiple platforms and sends intelligent notifications. With advanced features like game change detection, offline alerts, and enterprise-level debugging, it's perfect for communities wanting comprehensive stream tracking.

### ✨ Key Features

- 🔴 **6 Platform Support**: Twitch, YouTube, Kick, Rumble, TikTok, and NimoTV
- 📢 **Smart Notifications**: Live alerts, game change detection, and offline notifications
- 🎮 **Game Change Tracking**: Get notified when streamers switch games/categories
- ⚫ **Offline Alerts**: Know when your favorite streamers end their streams
- 📸 **High-Quality Thumbnails**: Stream previews with proper image handling
- 🛡️ **Permission Management**: Admin-only commands for streamer management
- 📊 **Rich Information**: Viewer counts, follower counts, stream titles, and more
- 🔧 **Easy Configuration**: Simple setup with comprehensive error handling
- 💾 **Persistent Storage**: Uses Enmap for reliable data storage
- 🐛 **Enterprise Debugging**: Comprehensive logging for troubleshooting

## 📊 Platform Support Status

| Platform | Status | Features | Thumbnails | Debug Logs | Emoji |
|----------|--------|----------|------------|------------|-------|
| 🟪 **Twitch** | ✅ Full Support | API-based, Viewer count, Game tracking | ✅ 1920x1080 | ✅ Complete | 🟣 |
| 🟥 **YouTube** | ✅ Full Support | Live detection, Subscriber count, Categories | ✅ Enhanced | ✅ Complete | 🔴 |
| 💚 **Kick** | ✅ Full Support | API wrapper, Viewer count, Categories | ✅ Object handling | ✅ Complete | 💚 |
| 🟢 **Rumble** | ✅ Full Support | Web scraping, Viewer count, Categories | ✅ Enhanced | ✅ Complete | 🟢 |
| ⚫ **TikTok** | ✅ Full Support | Live API, Hashtags, User count | ✅ Cover images | ✅ Complete | ⚫ |
| 🔶 **NimoTV** | ✅ Full Support | Web scraping, Viewer count, Categories | ✅ Enhanced | ✅ Complete | 🔶 |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 16.x or higher
- A Discord bot token and Application ID ([Create one here](https://discord.com/developers/applications))
- Discord server with appropriate permissions

### Getting Your Discord Credentials

1. **Go to [Discord Developer Portal](https://discord.com/developers/applications)**
2. **Create New Application** or select existing one
3. **Copy Application ID** from the General Information page
4. **Go to Bot section** and copy the Bot Token
5. **Get Guild ID** by enabling Developer Mode in Discord and right-clicking your server
6. **Important**: Keep all credentials secure and never share them publicly!

### Installation

1. **Download the Bot**
   ```bash
   # Download or clone the repository
   # Extract to your desired location
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Bot**
   Edit the `.env` file with your credentials:
   ```env
   # Discord Bot Configuration
   DISCORD_TOKEN=
   DISCORD_APPLICATION_ID=
   BOT_COLOR=#61CB2B
   FOOTER_TEXT=Bubbles Streamer Notification Bot
   FOOTER_ICON=https://i.ibb.co/Bqs3jh7/6302741.png
   
   # Optional: Database settings (if using external database)
   # DATABASE_URL=your_database_url_here
   ```

4. **Configure Bot Settings**
   Edit `config.json` for customization:
   ```json
   {
     "color": "#61CB2B",
     "footerText": "Streamer Notification Bot",
     "footerIcon": "https://your-icon-url.com/icon.png"
   }
   ```

5. **Start the Bot**
   ```bash
   # Production
   node src/index.js

   # Development with nodemon (if installed)
   npm run dev
   ```

## 🎮 Commands

### 👨‍💼 Admin Commands
*Requires Administrator permissions*

| Command | Description | Usage | Platforms |
|---------|-------------|-------|-----------|
| `/addstreamer` | Add a streamer to track | `/addstreamer platform:twitch name:username channel:#alerts` | All 6 platforms |
| `/removestreamer` | Remove a streamer from tracking | `/removestreamer name:username` | All platforms |

### 🛠️ Utility Commands
*Available to all users*

| Command | Description | Features |
|---------|-------------|----------|
| `/liststreamers` | Show all tracked streamers with real-time status | Live status checking |
| `/help` | Display command help | Comprehensive guide |
| `/ping` | Check bot latency | Performance metrics |

## 📱 Usage Examples

### Adding Streamers from Different Platforms
```bash
# Twitch streamer
/addstreamer platform:twitch name:ninja channel:#stream-alerts

# YouTube creator
/addstreamer platform:youtube name:mrbeast channel:#youtube-alerts

# Kick streamer
/addstreamer platform:kick name:trainwreckstv channel:#kick-alerts

# Rumble creator
/addstreamer platform:rumble name:timcast channel:#rumble-alerts

# TikTok live streamer
/addstreamer platform:tiktok name:charlidamelio channel:#tiktok-alerts

# NimoTV streamer
/addstreamer platform:nimotv name:streamer_name channel:#nimotv-alerts
```

## 🔔 Notification Types

### 1. **Live Notifications** 🔴
- Sent when a streamer goes live
- Includes stream title, viewer count, game/category
- High-quality thumbnail preview
- Direct link to stream

### 2. **Game Change Notifications** 🎮
- Triggered when streamers switch games/categories while live
- Shows previous game → new game
- Helps communities track content changes
- Works across all platforms

### 3. **Offline Notifications** ⚫
- Sent when streamers end their streams
- Includes final viewer count and stream duration
- Helps track streaming schedules
- Optional feature (enabled by default)

## ⚙️ Advanced Configuration

### 🔐 Environment Variables
Configure your bot securely using the `.env` file:

```env
# Discord Bot Configuration
DISCORD_TOKEN=
DISCORD_APPLICATION_ID=
BOT_COLOR=#61CB2B
FOOTER_TEXT=Bubbles Streamer Notification Bot
FOOTER_ICON=https://i.ibb.co/Bqs3jh7/6302741.png

# Optional: Database settings (if using external database)
# DATABASE_URL=your_database_url_here
```

### 🎨 Bot Customization
Configure appearance in `config.json`:

```json
{
  "color": "#61CB2B",
  "footerText": "Your Bot Name",
  "footerIcon": "https://your-icon-url.com/icon.png"
}
```

### 📊 Monitoring Settings
- **Check Interval**: 1 hour (3600 seconds)
- **Timeout**: 10 seconds per platform check
- **Retry Logic**: Built-in error handling with fallbacks
- **Debug Logging**: Comprehensive console output

## 🔧 Technical Details

### Enhanced Data Structure
Each tracked streamer includes comprehensive data:

```javascript
{
  id: "platform:username",           // Unique identifier
  name: "username",                  // Streamer username
  platform: "twitch",                // Platform name
  channelID: "123456789",            // Discord channel ID for alerts
  
  // Live stream data (when live)
  title: "Stream Title",             // Current stream title
  viewers: 1234,                     // Current viewer count (formatted: 1.2K)
  imageUrl: "https://...",           // High-quality stream thumbnail
  url: "https://...",                // Direct stream URL
  startedAt: "2025-10-10T...",       // When stream started (ISO format)
  game: "Game Name",                 // Current game/category
  bio: "Streamer bio",               // Streamer description
  followersCount: 50000,             // Follower/subscriber count
  verified: true,                    // Platform verification status
  profileImageUrl: "https://..."     // Streamer profile picture
}
```

### 🚀 Performance Optimizations

#### Twitch Integration
- **Multiple detection methods**: Helix API, GraphQL, and HTML fallback
- **API rate limiting**: Respects Twitch's rate limits
- **Thumbnail processing**: Automatic {width}x{height} replacement

#### Enhanced Error Handling
- **Timeout protection**: 10-second timeouts prevent hanging
- **Graceful degradation**: Fallback methods when APIs fail
- **Comprehensive logging**: Detailed error reporting and debugging

#### Memory Management
- **Efficient caching**: LastLiveData Map for state tracking
- **Automatic cleanup**: Prevents memory leaks
- **Optimized intervals**: 1-hour checks reduce resource usage

### Dependencies
- **[@sapphire/framework](https://www.sapphiredev.org/)**: Discord bot framework (v4.9.0+)
- **[discord.js](https://discord.js.org/)**: Discord API library (v14.21.0+)
- **[enmap](https://enmap.evie.dev/)**: Enhanced Map for data storage
- **[node-fetch](https://github.com/node-fetch/node-fetch)**: HTTP request library (ESM)
- **[kick.com-api](https://www.npmjs.com/package/kick.com-api)**: Kick.com API wrapper
- **[tiktok-live-connector](https://www.npmjs.com/package/tiktok-live-connector)**: TikTok Live API

## 🐛 Debugging & Troubleshooting

### Debug Output Examples

#### Twitch Debug Output
```
Checking Twitch live status for ninja...
Found API data for ninja: { title: "Fortnite", game: "Fortnite", viewers: 45000, thumbnail: "https://..." }
✅ Sent live alert for ninja in Server Name to #stream-alerts
```

#### Enhanced Error Handling
```
Error checking YouTube live status for @mrbeast: HTTP 429: Too Many Requests
Falling back to alternative detection method...
```

### Common Issues & Solutions

#### Bot Not Responding
- ✅ Check if the bot is online in your server
- ✅ Verify the `DISCORD_TOKEN` in `.env`
- ✅ Ensure the bot has proper permissions
- ✅ Check console for error messages

#### Stream Alerts Not Working
- ✅ Verify the streamer name is correct (case-sensitive)
- ✅ Check if the notification channel exists and bot has permissions
- ✅ Look for debug output in console
- ✅ Ensure platform is spelled correctly when adding

#### Commands Not Showing
- ✅ Re-invite the bot with slash command permissions
- ✅ Wait a few minutes for commands to sync globally
- ✅ Check if you have Administrator permissions for admin commands

#### Database Issues
- ✅ Ensure `data/` folder exists and is writable
- ✅ Check if `enmap.sqlite` files are created in `data/`
- ✅ Verify Node.js has write permissions in the directory

### 🔍 Debug Mode
Enable detailed logging by checking console output when running the bot. The enhanced debugging provides:

- **Platform connection status**
- **API response details**
- **Thumbnail processing information**
- **Notification delivery confirmation**
- **Error stack traces with context**

## 🔒 Security & Best Practices

### Security Features
- 🔐 **Environment Variables**: All sensitive data in `.env` file
- 🛡️ **Input Validation**: All user inputs are validated and sanitized
- 🚫 **Minimal Permissions**: No elevated system permissions required
- 📋 **Dependency Updates**: Regular security updates for all dependencies
- 🔒 **Git Security**: `.gitignore` configured to prevent token commits

### Required Bot Permissions
Ensure your bot has these permissions in your Discord server:

- ✅ **Send Messages** - For sending notifications
- ✅ **Use Slash Commands** - For bot commands
- ✅ **Embed Links** - For rich embed notifications
- ✅ **Attach Files** - For potential image attachments
- ✅ **Read Message History** - For command processing
- ✅ **Use External Emojis** - For platform emojis in embeds

## 📈 Performance & Limitations

### Performance Specifications
- **Memory Usage**: 50-150MB typical usage
- **CPU Usage**: Minimal when idle, spikes during hourly checks
- **Check Interval**: 1 hour (3600 seconds) per guild
- **Response Time**: <500ms for most commands
- **Concurrent Streamers**: Recommended max 50 per guild

### Platform Limitations
- ⚠️ **Rate Limiting**: Respects all platform rate limits
- ⚠️ **API Changes**: Platform updates may affect functionality
- ⚠️ **Geographical Restrictions**: Some platforms may be region-locked
- ⚠️ **Web Scraping**: YouTube and Rumble rely on HTML parsing

## 🎯 Use Cases

### Perfect For:
- **Gaming Communities**: Track favorite streamers across platforms
- **Content Creator Hubs**: Monitor multiple creators in one place
- **Esports Organizations**: Track team members and competitors
- **Fan Communities**: Stay updated with creator activities
- **Multi-Platform Creators**: Track creators who stream on multiple platforms

### Advanced Features:
- **Game Change Tracking**: Know when streamers switch games
- **Offline Monitoring**: Track streaming schedules and patterns
- **Real-Time Status**: `/liststreamers` command shows live status
- **Rich Embeds**: Comprehensive information in each notification

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Bug Reports
- Use GitHub issues to report bugs
- Include detailed steps to reproduce
- Provide environment details and console output

### 💡 Feature Requests
- Suggest new platforms or features
- Describe the use case and benefits
- Consider implementation complexity

### 🔧 Code Contributions
1. Fork the repository
2. Create a feature branch
3. Implement your changes with proper error handling
4. Add comprehensive debugging output
5. Test thoroughly across multiple platforms
6. Submit a pull request

## 📄 Database Information

### Database Files Required
The bot uses **Enmap** for data storage. The following files will be automatically created in the `data/` folder:

```
data/
├── enmap.sqlite          # Main database file
├── enmap.sqlite-shm      # Shared memory file (auto-generated)
└── enmap.sqlite-wal      # Write-ahead log file (auto-generated)
```

### Database Setup
1. **Automatic Creation**: Database files are created automatically on first run
2. **No Manual Setup**: No database installation required
3. **Persistent Storage**: Data survives bot restarts
4. **Backup Friendly**: Simply copy the `data/` folder to backup

### Data Stored
- **Guild Settings**: Server-specific configurations
- **Streamer Lists**: Tracked streamers per guild
- **Last Live Data**: State tracking for notifications
- **User Permissions**: Admin user tracking

## 🎉 What's New in This Version

### ✨ Major Enhancements
- 🆕 **NimoTV Support**: Added 6th platform with full feature support
- 🎮 **Game Change Detection**: Notifications when streamers switch games
- ⚫ **Offline Notifications**: Alerts when streams end
- 📸 **Enhanced Thumbnails**: Improved image handling across all platforms
- 🐛 **Enterprise Debugging**: Comprehensive logging for all platforms
- ⏰ **1-Hour Intervals**: Optimized checking frequency
- 🔄 **Real-Time Commands**: `/liststreamers` shows current status

### 🔧 Technical Improvements
- **Discord.js v14**: Updated to latest Discord API
- **Enhanced Error Handling**: Better fallback mechanisms
- **Memory Optimization**: Improved performance and stability
- **API Integration**: Better platform API usage where available
- **Thumbnail Processing**: Smart object/string URL handling

### 🎨 Platform-Specific Colors & Emojis
Each platform now has distinctive branding:
- 🟣 **Twitch**: Purple (#9146FF)
- 🔴 **YouTube**: Red (#FF0000)
- 💚 **Kick**: Green (#00FF00)
- 🟢 **Rumble**: Light Green (#90EE90)
- ⚫ **TikTok**: Black (#000000)
- 🔶 **NimoTV**: Orange (#FF6B35)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

### Important Disclaimers

> [!IMPORTANT]
> **Platform Compliance**: This bot uses official APIs where available and respectful web scraping for others. Please ensure your usage complies with each platform's Terms of Service.

> [!WARNING]
> **Rate Limiting**: The bot respects all platform rate limits. Excessive usage may result in temporary API restrictions.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**Made with ❤️ for the Discord community**

*Supporting 6 major streaming platforms with enterprise-level features*

</div>
