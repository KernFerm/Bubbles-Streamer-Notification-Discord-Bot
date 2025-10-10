# Security Policy

## Supported Versions

We currently support the following versions of the Streamer Notification Discord Bot with security updates:

| Version | Supported          | Node.js | Discord.js | Platforms | Status |
| ------- | ------------------ | ------- | ---------- | --------- | ------ |
| 3.0.x   | :white_check_mark: | 16.x+   | 14.21.0+   | 6 Platforms | Active |
| 2.0.x   | :warning:          | 16.x+   | 14.21.0+   | 5 Platforms | Security Only |
| 1.0.x   | :x:                | 16.x+   | 13.16.0+   | 4 Platforms | EOL    |
| < 1.0   | :x:                | -       | -          | Legacy    | EOL    |

### Platform Support Matrix

| Platform | Version 3.0.x | Security Features | API Type |
|----------|---------------|-------------------|----------|
| Twitch   | :white_check_mark: | Rate limiting, API fallbacks | Official API |
| YouTube  | :white_check_mark: | Timeout protection, HTML parsing | Web scraping |
| Kick     | :white_check_mark: | API wrapper, error handling | Unofficial API |
| Rumble   | :white_check_mark: | Web scraping, retry logic | Web scraping |
| TikTok   | :white_check_mark: | Live API, connection cleanup | Live API |
| NimoTV   | :white_check_mark: | Web scraping, enhanced parsing | Web scraping |

### Version Support Policy

- **Active Support**: The latest stable version (3.0.x) receives security updates, bug fixes, and new features
- **Security Updates Only**: Versions marked for security updates receive critical security patches only
- **End of Life (EOL)**: These versions no longer receive any updates and should be upgraded immediately

### Dependencies Security Status

Our bot relies on several key dependencies with security considerations:

#### Core Dependencies
- **Node.js**: 16.x or higher (LTS recommended for security patches)
- **Discord.js**: 14.21.0+ (latest for security fixes)
- **@sapphire/framework**: 5.3.6+ (command handling security)
- **Enmap**: 6.0.5+ (database security)

#### Platform-Specific Dependencies
- **node-fetch**: ESM import for secure HTTP requests
- **kick.com-api**: Third-party API wrapper (external security dependency)
- **tiktok-live-connector**: Live API connector (monitor for updates)

#### Security-Critical Dependencies
- **dotenv**: 16.4.5+ for secure environment variable management
- **ws**: WebSocket security (Discord.js dependency)
- **undici**: HTTP client security (node-fetch dependency)

### Known Security Considerations

#### Deprecation Warnings (Non-Critical)
These warnings appear during installation but do not affect security:
- `puppeteer@23.11.1` - Used by kick.com-api (external dependency)
- `glob@7.2.3` and `inflight@1.0.6` - Used by Jest testing framework
- `yaeti@0.0.6` - Used by tiktok-live-connector (external dependency)

**Status**: Safe to ignore - these are third-party package dependencies that do not impact the bot's core security.

### Upgrade Recommendations

- Always use the latest stable version (3.0.x) for the best security posture
- Keep Node.js updated to the latest LTS version for security patches
- Regularly audit dependencies: `npm audit` and `npm audit fix`
- Monitor platform API changes that might affect security
- Use environment variables exclusively for sensitive data

## Reporting a Vulnerability

We take security vulnerabilities seriously and appreciate responsible disclosure. If you discover a security vulnerability in the Streamer Notification Discord Bot, please follow these steps:

### 🚨 How to Report

**For Critical Security Issues:**
1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to the project maintainers with "SECURITY" in the subject line
3. Use GitHub's private security advisory feature if available
4. Include comprehensive details (see template below)

**Vulnerability Report Template:**
```
Subject: [SECURITY] Vulnerability in Streamer Notification Bot

Vulnerability Type: [Authentication/Authorization/Data Exposure/etc.]
Severity: [Critical/High/Medium/Low]
Affected Versions: [3.0.x, 2.0.x, etc.]
Platform(s) Affected: [Twitch/YouTube/Kick/etc. or All]

Description:
[Detailed description of the vulnerability]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Potential Impact:
[What could an attacker achieve with this vulnerability]

Environment Details:
- Bot Version: [e.g., 3.0.1]
- Node.js Version: [e.g., 18.17.0]
- Discord.js Version: [e.g., 14.21.0]
- Operating System: [e.g., Windows 11, Ubuntu 22.04]

Suggested Fix (if any):
[Your recommendation for fixing the issue]

Proof of Concept:
[Code, screenshots, or logs demonstrating the vulnerability]
```

### ⏱️ Response Timeline

| Phase | Timeline | Description |
|-------|----------|-------------|
| **Initial Response** | < 48 hours | Acknowledgment of receipt |
| **Investigation** | < 7 days | Assessment and verification |
| **Fix Development** | < 14 days | Patch development for critical issues |
| **Testing** | < 3 days | Security testing and validation |
| **Release** | < 21 days | Patched version release |
| **Disclosure** | 30-90 days | Public disclosure coordination |

### 🏆 Recognition

**Security Researcher Recognition:**
- Public acknowledgment in release notes (if desired)
- Addition to security contributors list
- Coordination on responsible disclosure timing

### 🔐 Security Scope

**In Scope for Security Reports:**
- Authentication and authorization bypasses
- Discord token or credential exposure
- Database injection or manipulation
- Remote code execution vulnerabilities
- Cross-site scripting (XSS) in web interfaces
- Path traversal or file disclosure issues
- Denial of Service (DoS) vulnerabilities
- Platform API abuse or rate limit bypasses
- Memory corruption or buffer overflow issues
- Privilege escalation vulnerabilities

**Platform-Specific Security Concerns:**
- Twitch API rate limiting bypasses
- YouTube scraping security issues
- Kick API authentication problems
- Rumble parsing vulnerabilities
- TikTok Live connector security flaws
- NimoTV scraping security issues

### 🚫 Out of Scope

**The following are outside our security scope:**
- Social engineering attacks against Discord users
- Third-party streaming platform vulnerabilities
- Discord's infrastructure security
- User's server misconfiguration
- Dependency vulnerabilities in upstream packages (report to respective maintainers)
- Issues requiring physical access to the hosting system
- Denial of service attacks against streaming platforms
- Brute force attacks against well-configured systems
- Issues in deprecated or unsupported versions (< 2.0.x)

### 🛡️ Security Measures We've Implemented

**Input Validation & Sanitization:**
- All user inputs validated and sanitized
- Discord username format validation
- Channel ID format validation
- Platform name whitelist validation

**Rate Limiting & DoS Protection:**
- 10-second timeouts on all external requests
- Built-in rate limiting for platform APIs
- Exponential backoff for failed requests
- Connection cleanup and resource management

**Credential Management:**
- Environment variable enforcement
- No hardcoded secrets in codebase
- Secure token handling practices
- Automatic token redaction in logs

**Error Handling & Information Disclosure:**
- Generic error messages to users
- Detailed logs for administrators only
- No stack traces exposed to end users
- Sanitized debug output

### 🔄 Security Update Process

**For Critical Vulnerabilities:**
1. Immediate patch development
2. Security-only release (no feature changes)
3. Coordinated disclosure with reporters
4. Public advisory publication
5. Automated security scanning updates

**For Non-Critical Issues:**
1. Fix included in next regular release
2. Security note in changelog
3. Updated documentation if needed

### Security Best Practices

When using this bot, please follow these comprehensive security recommendations:

#### 🔐 Bot Token & Credentials Security

**CRITICAL - Environment Variables Only**
```env
# Required in .env file
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here
NODE_ENV=production
```

**Security Requirements:**
- :white_check_mark: **ALWAYS** use `.env` files for credentials
- :x: **NEVER** put tokens in `config.json` or source code
- :white_check_mark: Use different tokens for development/production
- :white_check_mark: Regenerate tokens immediately if compromised
- :white_check_mark: Limit bot permissions to minimum required
- :white_check_mark: Enable 2FA on your Discord developer account

#### 🛡️ Discord Bot Permissions Security

**Required Permissions (Minimum)**
- Send Messages
- Use Slash Commands
- Embed Links
- Read Message History

**Optional Permissions**
- Attach Files (for enhanced embeds)
- Use External Emojis (for platform icons)

**Security Guidelines:**
- Never grant Administrator permissions
- Audit permissions regularly
- Use role-based access control in Discord
- Limit channel access where possible

#### 🌐 Network & API Security

**Platform API Security:**
- All HTTP requests use 10-second timeouts
- Rate limiting implemented for all platforms
- Error handling prevents information disclosure
- Fallback mechanisms reduce attack surface

**Outbound Connections:**
- `discord.com` - Discord API (required)
- `twitch.tv` - Twitch stream data
- `youtube.com` - YouTube stream data
- `kick.com` - Kick stream data
- `rumble.com` - Rumble stream data
- `tiktok.com` - TikTok stream data
- `nimo.tv` - NimoTV stream data

#### 💾 Database Security

**Enmap Database Protection:**
```
data/
├── enmap.sqlite          # Main database (contains streamer configs)
├── enmap.sqlite-shm      # Shared memory (temporary)
└── enmap.sqlite-wal      # Write-ahead log (temporary)
```

**Security Measures:**
- Database files are local-only (no remote access)
- No sensitive user data stored (only Discord IDs)
- Regular backup recommended with encryption
- File permissions should be restricted (600/700)
- Monitor for unauthorized file access

#### 🔒 Environment Security

**Development Environment:**
```bash
# Secure setup
NODE_ENV=development
DISCORD_TOKEN=dev_token_here
CLIENT_ID=dev_client_id_here
```

**Production Environment:**
```bash
# Production setup
NODE_ENV=production
DISCORD_TOKEN=prod_token_here
CLIENT_ID=prod_client_id_here
# Additional security headers if using reverse proxy
```

**File Security:**
- `.env` files are in `.gitignore` (never committed)
- Config files contain no sensitive data
- Log files don't contain tokens (sanitized output)
- Regular security updates for hosting environment

#### 🚨 Incident Response

**If Compromised:**
1. **Immediately** regenerate Discord bot token
2. Check Discord audit logs for unauthorized actions
3. Review server permissions and remove if necessary
4. Scan logs for suspicious activity
5. Update all credentials and API keys
6. Notify users if data may be affected

#### 🔍 Monitoring & Logging

**Security Monitoring:**
- Console logs for all platform connections
- Error tracking for failed requests
- Authentication status monitoring
- Rate limit monitoring and alerts

**Log Security:**
- Tokens are never logged in plain text
- User IDs are logged (not personal information)
- Error messages sanitized before output
- Debug logs can be disabled in production

### 📋 Scope

This security policy covers:

#### ✅ **In Security Scope**
- **Core Bot Application**: Main bot code and command handlers
- **Platform Integrations**: All 6 streaming platform handlers
  - Twitch API and GraphQL implementations
  - YouTube web scraping security
  - Kick API wrapper security
  - Rumble scraping security
  - TikTok Live connector security
  - NimoTV scraping security
- **Database Security**: Enmap database and data handling
- **Authentication**: Discord bot token and API security
- **Configuration**: Environment variable and config security
- **Dependencies**: Security of npm packages we directly control
- **Deployment**: Secure deployment practices and recommendations

#### ❌ **Out of Security Scope**

**Third-Party Services:**
- Streaming platform infrastructure (Twitch, YouTube, etc.)
- Discord's API and infrastructure security
- Third-party npm package vulnerabilities (report to upstream)
- Hosting provider security (AWS, Google Cloud, etc.)

**User Environment:**
- Discord server configuration and permissions
- Operating system security on user's machines
- Network security of user's internet connection
- Custom modifications or forks of the code

**Social Engineering:**
- Attacks targeting Discord users directly
- Phishing attempts against bot operators
- Social manipulation for credential theft

### 🔒 **Additional Security Resources**

#### Secure Configuration Examples

**Production Environment Variables:**
```bash
# Minimum required for security
export DISCORD_TOKEN="your_secure_bot_token"
export CLIENT_ID="your_application_id"
export GUILD_ID="your_server_id"
export NODE_ENV="production"

# Optional security enhancements
export LOG_LEVEL="error"  # Reduce log verbosity
export RATE_LIMIT_ENABLED="true"
```

**File Permissions (Linux/macOS):**
```bash
# Secure the .env file
chmod 600 .env

# Secure the data directory
chmod 700 data/
chmod 600 data/*.sqlite*
```

**Windows Security:**
```powershell
# Remove inheritance and set explicit permissions
icacls .env /inheritance:d
icacls .env /grant:r "%USERNAME%:F"
icacls .env /remove "Users"
```

#### Security Checklists

**Pre-Deployment Security Checklist:**
- [ ] All credentials in environment variables
- [ ] `.env` file in `.gitignore`
- [ ] Bot permissions minimized
- [ ] Database files secured
- [ ] Dependencies updated (`npm audit`)
- [ ] Firewall configured for hosting environment
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented

**Regular Security Maintenance:**
- [ ] Monthly dependency updates
- [ ] Quarterly token rotation
- [ ] Regular backup verification
- [ ] Log review for suspicious activity
- [ ] Permission audit
- [ ] Platform API changes monitoring

### 📞 **Emergency Contacts**

**For Critical Security Issues:**
- Create GitHub Security Advisory
- Email maintainers with [SECURITY] tag
- Include full vulnerability details

**For General Security Questions:**
- GitHub Discussions for non-sensitive topics
- Documentation issues via GitHub Issues
- Community Discord for best practices

---

### 📄 **Security Policy Version**

- **Version**: 3.0
- **Last Updated**: October 2025
- **Next Review**: January 2026
- **Covers Bot Versions**: 3.0.x (6-platform support)

---

*This security policy is regularly updated to reflect new features, platforms, and security best practices. Please check for updates when upgrading bot versions.*
