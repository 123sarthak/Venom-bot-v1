class AboutCommand {
    constructor() {
        this.name = 'about';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const aboutText = `🤖 **About Sarthak's Bot**

**📱 Bot Information:**
• Name: Sarthak's Bot
• Version: 1.0.0
• Creator: Sarthak
• Platform: Facebook Messenger

**🎯 Features:**
• 🎮 Tic Tac Toe Game
• 📥 Video Downloader
• 👑 Admin Commands
• 🎯 Easy to use commands
• 👋 Welcome/Goodbye messages

**🛠️ Technology:**
• Built with Node.js
• Facebook Messenger API
• SQLite Database
• Modern JavaScript (ES6+)

**📞 Contact:**
• Developer: Sarthak
• Bot Version: v1.0.0

**💡 Commands:**
Use !help to see all available commands!

Made with ❤️ by Sarthak`;

        return aboutText;
    }
}

module.exports = AboutCommand; 