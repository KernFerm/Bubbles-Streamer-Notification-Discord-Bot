# <div align="center">

![Discord.js](https://img.shields.io/badge/Discord.js-v14.21.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)
![License](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen.svg)

# Streamer Alerts Discord Bot


### 🚀 NO API KEYS REQUIRED - Easy Setup & Deployment

*A powerful Discord bot that tracks live streams across multiple platforms and sends real-time notifications to your Discord server.*

</div>

## 📋 Overview

![pic](https://github.com/KernFerm/Bubbles-Streamer-Notification-Discord-Bot/blob/main/screenshot/screenshot-noti.png)

**Streamer Alerts Bot** is a feature-rich Discord bot built with the Sapphire Framework that automatically monitors your favorite streamers across multiple platforms and sends instant notifications when they go live. Perfect for communities wanting to stay updated with their favorite content creators!

### ✨ Key Features

- 🔴 **Multi-Platform Support**: Monitors Twitch, YouTube, Kick, Rumble, and TikTok
- 📢 **Real-time Notifications**: Instant alerts with rich embeds when streamers go live
- 🎯 **Smart Tracking**: Prevents duplicate notifications and tracks stream changes
- 🛡️ **Permission Management**: Admin-only commands for streamer management
- 📊 **Rich Information**: Displays viewer counts, stream titles, thumbnails, and more
- 🔧 **Easy Configuration**: Simple setup with no API keys required
- 💾 **Persistent Storage**: Uses Enmap for reliable data storage

## 📊 Platform Support Status

| Platform | Status | Features | Notes |
|----------|--------|----------|-------|
| 🟪 **Twitch** | ✅ Working | Title, Viewers, Thumbnail, Start Time | Fully supported |
| 🟥 **YouTube** | ✅ Working | Title, Viewers, Thumbnail, Subscriber Count | Fully supported |
| 🟩 **Kick** | ✅ Working | Title, Viewers, Thumbnail, Follower Count | API-based tracking |
| 🟢 **Rumble** | ✅ Working | Title, Viewers, Thumbnail, Follower Count | Web scraping |
| 🔳 **TikTok** | ⚠️ In Progress | Basic live detection | Limited features |

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
5. **Important**: Keep both credentials secure and never share them publicly!

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/kernferm/streamer-alerts-discord-bot.git
   cd streamer-alerts-discord-bot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure the Bot**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   
   Edit `.env` with your bot settings:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_APPLICATION_ID=your_application_id_here
   BOT_COLOR=#61CB2B
   FOOTER_TEXT=Streamer Alerts Bot
   FOOTER_ICON=https://your-icon-url.com/icon.png
   ```

4. **Start the Bot**
   ```bash
   # Production
   npm start
   
   # Development with auto-restart
   npm run dev
   ```

## 🎮 Commands

### 👨‍💼 Admin Commands
*Requires Administrator permissions*

| Command | Description | Usage |
|---------|-------------|-------|
| `/addstreamer` | Add a streamer to track | `/addstreamer platform:twitch name:username channel:#alerts` |
| `/removestreamer` | Remove a streamer from tracking | `/removestreamer name:username` |

### 🛠️ Utility Commands
*Available to all users*

| Command | Description | Usage |
|---------|-------------|-------|
| `/liststreamers` | Show all tracked streamers | `/liststreamers` |
| `/help` | Display command help | `/help` |
| `/ping` | Check bot latency | `/ping` |

## 📱 Usage Examples

### Adding a Streamer
```
/addstreamer platform:twitch name:ninja channel:#stream-alerts
```

### Viewing Tracked Streamers
```
/liststreamers
```

### Removing a Streamer
```
/removestreamer name:ninja
```

## 🏗️ Project Structure

```
streamer-alerts-discord-bot/
├── src/
│   ├── commands/
│   │   ├── admin/
│   │   │   ├── addstreamer.js      # Add streamers to tracking
│   │   │   └── removestreamer.js   # Remove streamers from tracking
│   │   └── util/
│   │       ├── help.js             # Command help system
│   │       ├── liststreamers.js    # List tracked streamers
│   │       └── ping.js             # Bot latency check
│   ├── listeners/
│   │   └── interactionCreate.js    # Handle Discord interactions
│   ├── utils/
│   │   ├── confirm.js              # Confirmation utility
│   │   ├── embed.js                # Embed creation utility
│   │   ├── streamAlerts.js         # Stream monitoring system
│   │   ├── twitch.js               # Twitch platform handler
│   │   ├── youtube.js              # YouTube platform handler
│   │   ├── kick.js                 # Kick platform handler
│   │   ├── rumble.js               # Rumble platform handler
│   │   └── tiktok.js               # TikTok platform handler
│   └── index.js                    # Main bot entry point
├── .env.example                    # Environment configuration template
├── .gitignore                      # Git ignore file for security
├── db.js                           # Database management
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## ⚙️ Configuration

### 🔐 Environment Variables
**This is the secure way to configure your bot**. Environment variables keep sensitive data out of your code and git repository.

Create a `.env` file in your project root:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
BOT_COLOR=#61CB2B
FOOTER_TEXT=Streamer Alerts Bot
FOOTER_ICON=https://your-icon-url.com/icon.png
```

###  Security Best Practices
- ✅ **Use environment variables** for sensitive data
- ✅ **Never commit** tokens or API keys to git
- ✅ **Use .env files** for local development
- ✅ **Set environment variables** on production servers
- ✅ **Keep credentials secure** and rotate them regularly

### Bot Permissions
Ensure your bot has these permissions in your Discord server:

- ✅ Send Messages
- ✅ Use Slash Commands
- ✅ Embed Links
- ✅ Attach Files
- ✅ Read Message History
- ✅ Use External Emojis

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## 🔧 Technical Details

### Data Structure
Each tracked streamer follows this format:
```javascript
{
  id: "platform:username",        // Unique identifier
  name: "username",               // Streamer username
  platform: "twitch",             // Platform name
  channelID: "123456789",         // Discord channel ID for alerts
  isLive: false,                  // Current live status
  lastLiveAt: null,               // Last time streamer was live
  addedBy: "987654321",           // User ID who added streamer
  addedAt: "2025-08-13T...",      // When streamer was added
  
  // Live stream data (when live)
  title: "Stream Title",          // Current stream title
  viewers: 1234,                  // Current viewer count
  imageUrl: "https://...",        // Stream thumbnail
  url: "https://twitch.tv/...",   // Direct stream URL
  startedAt: "2025-08-13T...",    // When stream started
  bio: "Streamer bio",            // Streamer description
  followersCount: 50000,          // Follower/subscriber count
  verified: true,                 // Platform verification status
  profileImageUrl: "https://..."  // Streamer profile picture
}
```

### Dependencies
- **[@sapphire/framework](https://www.sapphiredev.org/)**: Discord bot framework
- **[discord.js](https://discord.js.org/)**: Discord API library
- **[enmap](https://enmap.evie.dev/)**: Enhanced Map for data storage
- **[node-fetch](https://github.com/node-fetch/node-fetch)**: HTTP request library
- **[kick.com-api](https://www.npmjs.com/package/kick.com-api)**: Kick.com API wrapper
- **[tiktok-live-connector](https://www.npmjs.com/package/tiktok-live-connector)**: TikTok Live API

## 🤝 Contributing

We welcome contributions to make this bot even better! Here's how you can help:

### 🐛 Bug Reports
- Use the [issue tracker](https://github.com/kernferm/streamer-alerts-discord-bot/issues) to report bugs
- Include detailed steps to reproduce the issue
- Provide your environment details (Node.js version, OS, etc.)

### 💡 Feature Requests
- Suggest new features through GitHub issues
- Describe the feature and its potential benefits
- Consider if it fits the bot's scope and purpose

### 🔧 Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 📝 Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Update documentation when needed

## 🚨 Troubleshooting

### Common Issues

#### Bot Not Responding
- ✅ Check if the bot is online in your server
- ✅ Verify the bot token in `config.json`
- ✅ Ensure the bot has proper permissions
- ✅ Check console for error messages

#### Stream Alerts Not Working
- ✅ Verify the streamer name is correct
- ✅ Check if the notification channel exists
- ✅ Ensure the bot can send messages in the channel
- ✅ Check if the platform is currently supported

#### Commands Not Showing
- ✅ Re-invite the bot with slash command permissions
- ✅ Wait a few minutes for commands to sync
- ✅ Check if you have the required permissions

#### Dependency Warnings During Installation
When running `npm install`, you may see warnings about deprecated packages:
- ⚠️ `puppeteer@23.11.1` - Used by kick.com-api (external dependency)
- ⚠️ `glob@7.2.3` and `inflight@1.0.6` - Used by Jest testing framework
- ⚠️ `yaeti@0.0.6` - Used by tiktok-live-connector (external dependency)

**These warnings are safe to ignore** as they come from third-party packages and don't affect the bot's functionality. The bot's core dependencies are up-to-date and secure.

### Getting Help
- 📖 Check the [documentation](https://github.com/BankkRoll/streamer-alerts-discord-bot/wiki)
- 🐛 [Report issues](https://github.com/kernferm/streamer-alerts-discord-bot/issues)
- 💬 Join our [Discord server](https://discord.gg/zQbJJgwbUv) for community support

## 📊 Performance & Limitations

### Performance Specs
- **Memory Usage**: ~50-100MB typical usage
- **CPU Usage**: Minimal when idle, spikes during stream checks
- **Check Interval**: 60 seconds per platform
- **Response Time**: <500ms for most commands

### Limitations
- ⚠️ Rate limited by platform APIs
- ⚠️ Web scraping may break with platform updates
- ⚠️ TikTok support is experimental
- ⚠️ Maximum ~100 streamers per guild recommended

## 🔒 Security

This project follows security best practices:
- 🔐 **Environment Variables**: Sensitive data (tokens) stored in environment variables, not in code
- 🛡️ **Input Validation**: All user inputs are validated and sanitized
- 🚫 **Minimal Permissions**: No elevated system permissions required
- 📋 **Dependency Updates**: Regular security updates for all dependencies
- 🔒 **Git Security**: `.gitignore` configured to prevent accidental token commits
- 🌍 **Environment Separation**: Different configurations for development and production

### 🔧 Security Configuration
- Use `.env` files for local development
- Set environment variables on production servers
- Never commit sensitive data to version control
- Regularly rotate bot tokens and API keys

See our [Security Policy](./SECURITY.md) for more details.

## 📄 License & Legal

### License
This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.

### Important Disclaimers

> [!IMPORTANT]
> **API Usage Disclaimer:**
> This bot uses unofficial APIs and web scraping methods to gather stream data. These methods are not owned or maintained by us. Usage is at your own risk, and we make no guarantees regarding availability, accuracy, or functionality.

> [!WARNING]
> **Platform Terms of Service:**
> Please ensure your use of this bot complies with the Terms of Service of each streaming platform. We are not responsible for any violations or account restrictions.

### Credits
- Built by [BankkRoll](https://github.com/BankkRoll)
- Powered by [Sapphire Framework](https://www.sapphiredev.org/)
- Enhanced & Built With ❤️ by [BubblesTheDev](https://github.com/kernferm)
- Icons and assets from respective platforms

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for the Discord community

</div>
