const { PREFIX } = require('../config/botConfig');

class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `ℹ️ *Sarthak's Bot Info*

✨ *Version:* **1.0.0**
👨‍💻 *Creator:* **Sarthak 🇳🇵**
💬 *Platform:* **Facebook Messenger**

🎯 *Features:*
- 🎮 Games: Tic Tac Toe
- 🎵 Music: Play any song by name from YouTube
- 🛠️ Utilities: Download videos from YouTube, Facebook, Instagram
- 👑 Admin: broadcast, addgroup, removegroup, listgroups
- 👋 Welcome/Goodbye messages
- 🤖 Smart command handling

🔥 *Popular Commands:*
• **${PREFIX}help** — Show help
• **${PREFIX}play <song name>** — Play a song (YouTube audio)
• **${PREFIX}tictactoe** — Play a game
• **${PREFIX}download <url>** — Download video
• **${PREFIX}about** — About the bot
• **${PREFIX}stats** — Bot stats

💡 *Example:*
${PREFIX}play shape of you

🔧 *Troubleshooting:*
If !play shows "sign in to confirm you're not a bot":
• Add YouTube cookies to youtube_cookies.txt
• Try different songs
• Use !download <youtube_url> instead
• Check README.md for detailed solutions

Made with ❤️ by Sarthak 🇳🇵`;
        return infoText;
    }
}

module.exports = InfoCommand; 