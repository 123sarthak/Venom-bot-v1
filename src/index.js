require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { TicTacToe } = require('./games/tictactoe');
const { VideoDownloader } = require('./utils/videoDownloader');
const { CommandHandler } = require('./handlers/commandHandler');
const { COMMAND_CATEGORIES, TEXT_STYLES } = require('./config/botConfig');

const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Initialize handlers and utilities
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

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>${TEXT_STYLES.BOT_NAME}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        text-align: center;
                        background: #f0f2f5;
                    }
                    h1 { 
                        color: #1877F2;
                        font-size: 2.5em;
                        margin-bottom: 20px;
                    }
                    .status { 
                        color: #4CAF50;
                        font-weight: bold;
                        margin: 20px 0;
                        padding: 10px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .commands {
                        text-align: left;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .category {
                        margin: 15px 0;
                        padding: 10px;
                        background: #f8f9fa;
                        border-radius: 5px;
                    }
                    .admin {
                        color: #e74c3c;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <h1>${TEXT_STYLES.BOT_NAME}</h1>
                <div class="status">✅ Bot is running!</div>
                <div class="commands">
                    <h2>Available Commands:</h2>
                    ${Array.from(commandHandler.categories.entries())
                        .map(([category, commands]) => `
                            <div class="category">
                                <h3>${category}</h3>
                                <ul>
                                    ${Array.from(commands.entries())
                                        .map(([cmd, info]) => `
                                            <li>
                                                <code>!${cmd}</code>
                                                ${info.isAdmin ? '<span class="admin">👑 Admin</span>' : ''}
                                            </li>
                                        `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                </div>
                <p>Server is running on port ${PORT}</p>
            </body>
        </html>
    `);
});

// Webhook verification
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Handle incoming messages
app.post('/webhook', async (req, res) => {
    if (req.body.object === 'page') {
        for (const entry of req.body.entry) {
            for (const event of entry.messaging) {
                if (event.message && event.message.text) {
                    const senderId = event.sender.id;
                    const message = event.message.text;

                    // Handle prefix-only message
                    if (message === '!') {
                        await sendMessage(senderId, commandHandler.getAboutMessage());
                        continue;
                    }

                    // Handle commands
                    if (message.startsWith('!')) {
                        const [command, ...args] = message.slice(1).split(' ');
                        const response = await commandHandler.handleCommand(senderId, command, args.join(' '));
                        await sendMessage(senderId, response);
                    }
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

// Function to send messages
async function sendMessage(recipientId, message) {
    try {
        await axios.post(`https://graph.facebook.com/v18.0/me/messages`, {
            recipient: { id: recipientId },
            message: { text: message }
        }, {
            params: { access_token: PAGE_ACCESS_TOKEN }
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Start server with error handling
app.listen(PORT, () => {
    console.log(`🤖 ${TEXT_STYLES.BOT_NAME} is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see the bot status`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
}); 