const { PREFIX } = require('../config/botConfig');

class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `🤖 Sarthak's Bot - Complete Command List

🎯 General Commands:
• ${PREFIX}help - Show all commands
• ${PREFIX}about - About the bot and developer
• ${PREFIX}stats - Show bot statistics
• ${PREFIX}info - Show this information

🎮 Game Commands:
• ${PREFIX}tictactoe - Start a new Tic Tac Toe game
• ${PREFIX}tictactoe <position> - Make a move (1-9)

🛠️ Utility Commands:
• ${PREFIX}download <url> - Download video from YouTube, Facebook, or Instagram

👑 Admin Commands:
• ${PREFIX}broadcast <message> - Send message to all groups
• ${PREFIX}addgroup - Add current group to bot's list
• ${PREFIX}removegroup - Remove current group from bot's list
• ${PREFIX}listgroups - List all groups where bot is active

🎉 New Features:
• 👋 Welcome messages when someone joins
• 👋 Goodbye messages when someone leaves
• 🤖 Default message when only ! is used
• 🎮 Enhanced Tic Tac Toe game
• 📊 Real-time bot statistics
• 📥 Real video downloader for YouTube, Facebook, and Instagram

💡 Usage Examples:
• ${PREFIX}help - See all commands
• ${PREFIX}tictactoe - Start a game
• ${PREFIX}about - Learn about the bot
• ${PREFIX}stats - Check bot stats
• ${PREFIX}download <url> - Download videos

🎮 Tic Tac Toe Positions:
1 | 2 | 3
─────────
4 | 5 | 6
─────────
7 | 8 | 9

📥 Video Download Platforms:
• 🎥 YouTube Videos
• 📘 Facebook Videos
• 📷 Instagram Videos & Reels

🤖 Sarthak's Bot v1.0.0
👨‍💻 Created by Sarthak
📱 Platform: Facebook Messenger`;

        return infoText;
    }
}

module.exports = InfoCommand; 