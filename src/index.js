require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { FacebookAPI } = require('./utils/facebookApi');
const { CommandHandler } = require('./handlers/commandHandler');
const { TicTacToe } = require('./games/tictactoe');
const { VideoDownloader } = require('./utils/videoDownloader');
const { COMMAND_CATEGORIES, TEXT_STYLES } = require('./config/botConfig');
const { handleCommand } = require('./handlers/commandHandler');
const { formatText } = require('./utils/textFormatter');

const app = express();
const PORT = process.env.PORT || 3000;
const prefix = process.env.PREFIX || '!';
const adminIds = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());

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
    try {
        console.log('🤖 Starting Venom Bot...');
        
        // Initialize Facebook API
        const initialized = await facebookApi.initialize();
        if (!initialized) {
            throw new Error('Failed to initialize Facebook API');
        }

        // Set up message listener
        facebookApi.listen(async (message) => {
            try {
                const { threadID, senderID, body } = message;
                
                // Log message details
                console.log(`📨 New message from ${senderID} in thread ${threadID}`);
                console.log(`💬 Message: ${body}`);

                // Check if message starts with prefix
                if (!body.startsWith(prefix)) {
                    console.log('❌ Message does not start with prefix, ignoring');
                    return;
                }

                // Parse command
                const args = body.slice(prefix.length).trim().split(/ +/);
                const command = args.shift().toLowerCase();

                console.log(`🔍 Command detected: ${command}`);
                console.log(`📝 Arguments: ${args.join(', ')}`);

                // Handle command using commandHandler
                const response = await commandHandler.handleCommand(senderID, command, args);
                
                if (response) {
                    await facebookApi.sendMessage(threadID, response);
                } else {
                    // If no response, send help message
                    await facebookApi.sendMessage(threadID, commandHandler.getHelpMessage());
                }
            } catch (error) {
                console.error('❌ Error handling message:', error);
                try {
                    await facebookApi.sendMessage(message.threadID, '❌ An error occurred while processing your command. Please try again later.');
                } catch (sendError) {
                    console.error('❌ Error sending error message:', sendError);
                }
            }
        });

        // Set up health check endpoint
        app.get('/', (req, res) => {
            res.json({ status: 'ok', uptime: process.uptime() });
        });

        // Start server
        app.listen(PORT, () => {
            console.log(`🌐 Server is running on port ${PORT}`);
            console.log(`✅ Bot is ready! Use prefix "${prefix}" to interact with the bot.`);
        });

    } catch (error) {
        console.error('❌ Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
initializeBot(); 