module.exports = {
    // Bot Configuration
    PREFIX: process.env.PREFIX || '!',
    ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [],
    
    // Bot Information
    BOT_INFO: {
        name: "Sarthak's Bot",
        version: "1.0.0",
        creator: "Sarthak",
        description: "A powerful Facebook Messenger bot with games and utilities",
        features: [
            "🎮 Tic Tac Toe Game",
            "📥 Video Downloader",
            "👑 Admin Commands",
            "🎯 Easy to use commands"
        ]
    },

    // Command Categories
    COMMAND_CATEGORIES: {
        GENERAL: "🎯 General Commands",
        GAMES: "🎮 Game Commands",
        UTILITY: "🛠️ Utility Commands",
        ADMIN: "👑 Admin Commands"
    },

    // Stylish Text Styles
    TEXT_STYLES: {
        BOLD: 'bold',
        ITALIC: 'italic',
        CODE: 'code',
        HEADER: 'header',
        SUBHEADER: 'subheader',
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
        DEV: 'dev',
        ADMIN: 'admin'
    }
}; 