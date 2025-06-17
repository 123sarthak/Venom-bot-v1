const { PREFIX } = require('../config/botConfig');

class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `ℹ️ *Sarthak's Bot Info*

✨ *Version:* **1.0.0**
👨‍💻 *Creator:* **Sarthak**
💬 *Platform:* **Facebook Messenger**

🎯 *Features:*
- 🎮 Games: Tic Tac Toe
- 🛠️ Utilities: Download videos from YouTube, Facebook, Instagram
- 👑 Admin: broadcast, addgroup, removegroup, listgroups
- 👋 Welcome/Goodbye messages
- 🤖 Smart command handling

🔥 *Popular Commands:*
• **${PREFIX}help** — Show help
• **${PREFIX}tictactoe** — Play a game
• **${PREFIX}download <url>** — Download video
• **${PREFIX}about** — About the bot
• **${PREFIX}stats** — Bot stats

💡 *Example:*
${PREFIX}download https://www.youtube.com/watch?v=dQw4w9WgXcQ

Made with ❤️ by Sarthak`;
        return infoText;
    }
}

module.exports = InfoCommand; 