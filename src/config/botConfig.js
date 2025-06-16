module.exports = {
    // Bot Configuration
    PREFIX: '!',
    ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [],
    COMMAND_COOLDOWN: 2000, // 2 seconds
    MAX_MESSAGE_LENGTH: 2000,
    DEFAULT_LANGUAGE: 'en',
    
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