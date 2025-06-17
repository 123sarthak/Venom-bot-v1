class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `🤖 **Sarthak's Bot - Complete Command List**

**🎯 General Commands:**
• !help - Show all commands
• !about - About the bot and developer
• !stats - Show bot statistics
• !info - Show this information

**🎮 Game Commands:**
• !tictactoe - Start a new Tic Tac Toe game
• !tictactoe <position> - Make a move (1-9)

**🛠️ Utility Commands:**
• !download <url> - Download video from YouTube, Facebook, or Instagram

**👑 Admin Commands:**
• !broadcast <message> - Send message to all groups
• !addgroup - Add current group to bot's list
• !removegroup - Remove current group from bot's list
• !listgroups - List all groups where bot is active

**🎉 New Features:**
• 👋 Welcome messages when someone joins
• 👋 Goodbye messages when someone leaves
• 🤖 Default message when only ! is used
• 🎮 Enhanced Tic Tac Toe game
• 📊 Real-time bot statistics
• 📥 **Real video downloader** for YouTube, Facebook, and Instagram

**💡 Usage Examples:**
• !help - See all commands
• !tictactoe - Start a game
• !about - Learn about the bot
• !stats - Check bot stats
• !download <url> - Download videos

**🎮 Tic Tac Toe Positions:**
1 | 2 | 3
─────────
4 | 5 | 6
─────────
7 | 8 | 9

**📥 Video Download Platforms:**
• 🎥 YouTube Videos
• 📘 Facebook Videos
• 📷 Instagram Videos & Reels

**🤖 Sarthak's Bot v1.0.0**
**👨‍💻 Created by Sarthak**
**📱 Platform: Facebook Messenger**`;

        return infoText;
    }
}

module.exports = InfoCommand; 