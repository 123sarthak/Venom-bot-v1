class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Shows all available commands';
    }

    async execute(args, context) {
        const helpText = `🎯 **Available Commands**

**�� Game Commands:**
• !tictactoe - Start a new Tic Tac Toe game
• !tictactoe <position> - Make a move (1-9)

**📋 General Commands:**
• !help - Show this help message
• !info - Show bot information
• !about - About the bot and developer
• !stats - Show bot statistics

**🛠️ Utility Commands:**
• !download <url> - Download video from URL

**👑 Admin Commands:**
• !broadcast <message> - Send message to all groups
• !addgroup - Add current group to bot's list
• !removegroup - Remove current group from bot's list
• !listgroups - List all groups where bot is active

**💡 Usage:**
Use !<command> to execute any command.
Example: !tictactoe to start a game

**🎮 Tic Tac Toe Positions:**
1 | 2 | 3
─────────
4 | 5 | 6
─────────
7 | 8 | 9

Sarthak's Bot v1.0.0`;

        return helpText;
    }
}

module.exports = HelpCommand; 