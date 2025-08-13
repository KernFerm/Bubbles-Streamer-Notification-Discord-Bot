# Security Policy

## Supported Versions

We currently support the following versions of the Bubbles Streamer Notification Discord Bot with security updates:

| Version | Supported          | Node.js | Discord.js | Status |
| ------- | ------------------ | ------- | ---------- | ------ |
| 2.0.x   | :white_check_mark: | 16.x+   | 14.21.0+   | Active |
| 1.0.x   | :x:                | 16.x+   | 13.16.0+   | EOL    |
| < 1.0   | :x:                | -       | -          | EOL    |

### Version Support Policy

- **Active Support**: The latest stable version receives security updates, bug fixes, and new features
- **Security Updates Only**: Versions marked for security updates receive critical security patches only
- **End of Life (EOL)**: These versions no longer receive any updates and should be upgraded immediately

### Dependencies Support

Our bot relies on several key dependencies. We maintain compatibility with:

- **Node.js**: 16.x or higher (LTS recommended)
- **Discord.js**: 14.21.0 or higher
- **Sapphire Framework**: 5.3.6 or higher
- **Enmap**: 6.0.5 or higher
- **dotenv**: 16.4.5 or higher for secure environment variable management

### Upgrade Recommendations

- Always use the latest stable version (2.0.x) for the best security posture
- Keep Node.js updated to the latest LTS version
- Regularly update dependencies using `npm audit` and `npm update`
- Monitor our releases for security announcements
- Migrate from config.json to environment variables for enhanced security

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to the project maintainers or create a private security advisory on GitHub
3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Bot version and environment details
   - Suggested fix (if any)

### What to Expect

- **Initial Response**: We aim to acknowledge receipt within 48 hours
- **Investigation**: We will investigate and assess the vulnerability within 7 days
- **Resolution**: Critical vulnerabilities will be patched within 14 days
- **Disclosure**: We follow responsible disclosure practices

### Security Best Practices

When using this bot, please follow these security recommendations:

#### Bot Token Security
- **REQUIRED**: Use environment variables (`.env` file) for bot tokens and Application IDs
- Never commit tokens or sensitive data to version control
- Regenerate tokens immediately if compromised
- Limit bot permissions to only what's necessary
- Always set `DISCORD_TOKEN` and `DISCORD_APPLICATION_ID` in your environment

#### Environment Security
- Use `.env` files for local development (automatically ignored by git)
- Set environment variables directly on production servers
- Never use config.json files in production environments
- Regularly rotate tokens and API keys

#### Server Security
- Keep your hosting environment updated
- Use firewalls and proper network security
- Monitor logs for suspicious activity
- Implement proper access controls

#### Database Security
- Secure your Enmap database files
- Regular backups with encryption
- Limit file system permissions
- Monitor for unauthorized access

### Scope

This security policy covers:
- The main bot application code (Bubbles Streamer Notification Discord Bot)
- Configuration and setup scripts
- Environment variable security practices
- Dependencies and their known vulnerabilities
- Deployment and hosting recommendations

### Out of Scope

The following are outside our security scope:
- Third-party streaming platform APIs
- Discord's infrastructure
- User's server configuration
- Custom modifications to the code
