const { PREFIX } = require('../config/botConfig');

class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Shows all available commands';
    }

    async execute(args, context) {
        const helpText = `✨ *Sarthak's Bot Help* ✨

🟢 *General Commands:*
• **${PREFIX}help** — Show this help message
• **${PREFIX}info** — Bot information
• **${PREFIX}about** — About the bot
• **${PREFIX}stats** — Bot statistics

🎮 *Game Commands:*
• **${PREFIX}tictactoe** — Start a new Tic Tac Toe game
• **${PREFIX}tictactoe <position>** — Make a move (1-9)

🛠️ *Utility Commands:*
• **${PREFIX}download <url>** — Download video from YouTube, Facebook, or Instagram

👑 *Admin Commands:*
• **${PREFIX}broadcast <message>** — Send message to all groups
• **${PREFIX}addgroup** — Add current group to bot's list
• **${PREFIX}removegroup** — Remove current group from bot's list
• **${PREFIX}listgroups** — List all groups where bot is active

💡 *Examples:*
- **${PREFIX}tictactoe**
- **${PREFIX}download https://www.youtube.com/watch?v=dQw4w9WgXcQ**
- **${PREFIX}about**

🎲 *Tic Tac Toe Board:*
1️⃣ | 2️⃣ | 3️⃣
─────────
4️⃣ | 5️⃣ | 6️⃣
─────────
7️⃣ | 8️⃣ | 9️⃣

🤖 *Enjoy using Sarthak's Bot!*`;
        return helpText;
    }
}

module.exports = HelpCommand; 