const { PREFIX } = require('../config/botConfig');

class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Shows all available commands';
    }

    async execute(args, context) {
        const helpText = `🎯 **Available Commands**

**🎮 Game Commands:**
• ${PREFIX}tictactoe - Start a new Tic Tac Toe game
• ${PREFIX}tictactoe <position> - Make a move (1-9)

**📋 General Commands:**
• ${PREFIX}help - Show this help message
• ${PREFIX}info - Show bot information
• ${PREFIX}about - About the bot and developer
• ${PREFIX}stats - Show bot statistics

**🛠️ Utility Commands:**
• ${PREFIX}download <url> - Download video from YouTube, Facebook, or Instagram

**👑 Admin Commands:**
• ${PREFIX}broadcast <message> - Send message to all groups
• ${PREFIX}addgroup - Add current group to bot's list
• ${PREFIX}removegroup - Remove current group from bot's list
• ${PREFIX}listgroups - List all groups where bot is active

**💡 Usage:**
Use ${PREFIX}<command> to execute any command.
Example: ${PREFIX}tictactoe to start a game

**🎮 Tic Tac Toe Positions:**
1 | 2 | 3
─────────
4 | 5 | 6
─────────
7 | 8 | 9

**📥 Video Download Examples:**
• YouTube: ${PREFIX}download https://www.youtube.com/watch?v=dQw4w9WgXcQ
• Facebook: ${PREFIX}download https://www.facebook.com/watch?v=123456789
• Instagram: ${PREFIX}download https://www.instagram.com/p/ABC123/

Sarthak's Bot v1.0.0`;

        return helpText;
    }
}

module.exports = HelpCommand; 