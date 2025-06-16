require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { FacebookAPI } = require('./utils/facebookApi');
const { CommandHandler } = require('./handlers/commandHandler');
const { TicTacToe } = require('./games/tictactoe');
const { VideoDownloader } = require('./utils/videoDownloader');
const { COMMAND_CATEGORIES, TEXT_STYLES } = require('./config/botConfig');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize handlers and utilities
const facebookApi = new FacebookAPI();
const commandHandler = new CommandHandler();
const ticTacToe = new TicTacToe();
const videoDownloader = new VideoDownloader();

// Register commands
commandHandler.registerCommand('help', 
    async (senderId) => commandHandler.getHelpMessage(),
    COMMAND_CATEGORIES.GENERAL
);

commandHandler.registerCommand('about',
    async (senderId) => commandHandler.getAboutMessage(),
    COMMAND_CATEGORIES.GENERAL
);

commandHandler.registerCommand('tictactoe',
    async (senderId, args) => {
        if (args) {
            return ticTacToe.makeMove(senderId, args);
        }
        return ticTacToe.startGame(senderId);
    },
    COMMAND_CATEGORIES.GAMES
);

commandHandler.registerCommand('download',
    async (senderId, args) => {
        if (!args) {
            return 'Please provide a video URL to download.';
        }
        return videoDownloader.downloadVideo(args);
    },
    COMMAND_CATEGORIES.UTILITY
);

// Admin commands
commandHandler.registerCommand('broadcast',
    async (senderId, args) => {
        if (!args) {
            return 'Please provide a message to broadcast.';
        }
        // Implement broadcast functionality here
        return 'Broadcast message sent to all users.';
    },
    COMMAND_CATEGORIES.ADMIN,
    true
);

commandHandler.registerCommand('stats',
    async (senderId) => {
        // Implement stats functionality here
        return '📊 Bot Statistics:\n' +
               '• Total Users: 0\n' +
               '• Active Games: 0\n' +
               '• Total Downloads: 0';
    },
    COMMAND_CATEGORIES.ADMIN,
    true
);

// Initialize Facebook API
async function initializeBot() {
    console.log('🤖 Initializing Sarthak\'s Bot...');
    const success = await facebookApi.initialize();
    
    if (success) {
        console.log('✅ Bot is ready to use!');
        
        // Start listening for messages
        facebookApi.listen(async (message) => {
            const { threadID, body, senderID } = message;

            // Handle prefix-only message
            if (body === '!') {
                await facebookApi.sendMessage(threadID, commandHandler.getAboutMessage());
                return;
            }

            // Handle commands
            if (body.startsWith('!')) {
                const [command, ...args] = body.slice(1).split(' ');
                const response = await commandHandler.handleCommand(senderID, command, args.join(' '));
                await facebookApi.sendMessage(threadID, response);
            }
        });
    } else {
        console.error('❌ Failed to initialize bot');
        process.exit(1);
    }
}

// Start the bot
initializeBot();

// Keep the server running
app.listen(PORT, () => {
    console.log(`🌐 Server is running on port ${PORT}`);
}); 