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
• 📥 **Real Video Downloader** (YouTube, Facebook, Instagram)
• 👑 Admin Commands
• 🎯 Easy to use commands
• 👋 Welcome/Goodbye messages
• 🤖 Smart command handling

**🛠️ Technology:**
• Built with Node.js
• Facebook Messenger API
• SQLite Database
• Modern JavaScript (ES6+)
• ytdl-core for YouTube downloads
• Axios for HTTP requests

**📥 Video Download Support:**
• 🎥 **YouTube Videos** - Full support with ytdl-core
• 📘 **Facebook Videos** - Direct video extraction
• 📷 **Instagram Videos & Reels** - Media download support
• 💾 **Automatic cleanup** - Files deleted after 24 hours

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