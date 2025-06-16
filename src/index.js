require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { TicTacToe } = require('./games/tictactoe');
const { VideoDownloader } = require('./utils/videoDownloader');

const app = express();
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || '!';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Initialize games and utilities
const ticTacToe = new TicTacToe();
const videoDownloader = new VideoDownloader();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Root route
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Sarthak's Messenger Bot</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        text-align: center;
                    }
                    h1 { color: #1877F2; }
                    .status { 
                        color: #4CAF50;
                        font-weight: bold;
                        margin: 20px 0;
                    }
                    .commands {
                        text-align: left;
                        background: #f5f5f5;
                        padding: 20px;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <h1>🤖 Sarthak's Messenger Bot</h1>
                <div class="status">✅ Bot is running!</div>
                <div class="commands">
                    <h2>Available Commands:</h2>
                    <ul>
                        <li><code>${PREFIX}help</code> - Show all commands</li>
                        <li><code>${PREFIX}tictactoe</code> - Start a new Tic Tac Toe game</li>
                        <li><code>${PREFIX}download &lt;url&gt;</code> - Download video from URL</li>
                        <li><code>${PREFIX}about</code> - About Sarthak's Bot</li>
                    </ul>
                </div>
                <p>Server is running on port ${PORT}</p>
            </body>
        </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Verify webhook
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

                    // Handle commands
                    if (message.startsWith(PREFIX)) {
                        const command = message.slice(PREFIX.length).toLowerCase().split(' ')[0];
                        const args = message.slice(PREFIX.length + command.length).trim();

                        switch (command) {
                            case 'help':
                                await sendMessage(senderId, `🤖 *Sarthak's Bot Commands*\n\n` +
                                    `${PREFIX}help - Show this help message\n` +
                                    `${PREFIX}tictactoe - Start a new Tic Tac Toe game\n` +
                                    `${PREFIX}download <url> - Download video from URL\n` +
                                    `${PREFIX}about - About Sarthak's Bot`);
                                break;

                            case 'tictactoe':
                                const gameResponse = await ticTacToe.startGame(senderId);
                                await sendMessage(senderId, gameResponse);
                                break;

                            case 'download':
                                if (!args) {
                                    await sendMessage(senderId, 'Please provide a video URL to download.');
                                    return;
                                }
                                const downloadResponse = await videoDownloader.downloadVideo(args);
                                await sendMessage(senderId, downloadResponse);
                                break;

                            case 'about':
                                await sendMessage(senderId, "🤖 *Sarthak's Bot*\n\n" +
                                    "A powerful Facebook Messenger bot created by Sarthak\n" +
                                    "Features:\n" +
                                    "• Tic Tac Toe Game\n" +
                                    "• Video Downloader\n" +
                                    "• Command Prefix System\n\n" +
                                    "Use !help to see all commands!");
                                break;

                            default:
                                await sendMessage(senderId, 'Unknown command. Use !help to see available commands.');
                        }
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

// Start server with error handling
app.listen(PORT, () => {
    console.log(`🤖 Sarthak's Bot is running on port ${PORT}`);
    console.log(`Using command prefix: ${PREFIX}`);
    console.log(`Visit http://localhost:${PORT} to see the bot status`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
}); 