# Security Policy

## Supported Versions

We currently support the following versions of the Streamer Alerts Discord Bot with security updates:

| Version | Supported          | Node.js | Discord.js | Status |
| ------- | ------------------ | ------- | ---------- | ------ |
| 1.0.x   | :white_check_mark: | 16.x+   | 13.16.0+   | Active |
| < 1.0   | :x:                | -       | -          | EOL    |

### Version Support Policy

- **Active Support**: The latest stable version receives security updates, bug fixes, and new features
- **Security Updates Only**: Versions marked for security updates receive critical security patches only
- **End of Life (EOL)**: These versions no longer receive any updates and should be upgraded immediately

### Dependencies Support

Our bot relies on several key dependencies. We maintain compatibility with:

- **Node.js**: 16.x or higher (LTS recommended)
- **Discord.js**: 13.16.0 or higher
- **Sapphire Framework**: 3.1.0 or higher
- **Enmap**: 6.0.5 or higher

### Upgrade Recommendations

- Always use the latest stable version for the best security posture
- Keep Node.js updated to the latest LTS version
- Regularly update dependencies using `npm audit` and `npm update`
- Monitor our releases for security announcements

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to the project maintainers with details about the vulnerability
3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Initial Response**: We aim to acknowledge receipt within 48 hours
- **Investigation**: We will investigate and assess the vulnerability within 7 days
- **Resolution**: Critical vulnerabilities will be patched within 14 days
- **Disclosure**: We follow responsible disclosure practices

### Security Best Practices

When using this bot, please follow these security recommendations:

#### Bot Token Security
- Never commit your bot token to version control
- Use environment variables or secure configuration files
- Regenerate tokens if compromised
- Limit bot permissions to only what's necessary

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
- The main bot application code
- Configuration and setup scripts
- Dependencies and their known vulnerabilities
- Deployment and hosting recommendations

### Out of Scope

The following are outside our security scope:
- Third-party streaming platform APIs
- Discord's infrastructure
- User's server configuration
- Custom modifications to the code
