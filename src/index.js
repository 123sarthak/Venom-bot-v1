require('dotenv').config();
const { FacebookAPI } = require('./utils/facebookApi');
const { formatText } = require('./utils/textFormatter');
const { PREFIX, ADMIN_IDS } = require('./config/botConfig');
const TicTacToe = require('./games/tictactoe');
const InfoCommand = require('./commands/info');

// Initialize Facebook API
const fb = new FacebookAPI();

// Initialize games
const tictactoe = new TicTacToe();

// Initialize commands
const infoCommand = new InfoCommand();

// Command handler
async function handleCommand(message) {
    const { threadID, senderID, body, mentions } = message;
    const isAdmin = ADMIN_IDS.includes(senderID);

    // Check if message starts with prefix
    if (!body.startsWith(PREFIX)) return;

    // Split command and arguments
    const [cmd, ...args] = body.slice(PREFIX.length).trim().split(' ');

    try {
        let response;

        // Handle commands
        switch (cmd.toLowerCase()) {
            case 'tictactoe':
                // Check if there's a mention
                const mentionedIds = Object.keys(mentions || {});
                if (args.length === 0) {
                    // Start a single-player game
                    response = tictactoe.startGame(senderID);
                } else if (mentionedIds.length > 0) {
                    // Start a two-player game with the mentioned user
                    response = tictactoe.startGame(senderID, mentionedIds[0]);
                } else {
                    // Make a move
                    response = tictactoe.makeMove(senderID, args[0]);
                }
                break;

            case 'info':
                response = await infoCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            default:
                response = formatText(`❌ Unknown command: ${cmd}`);
        }

        // Send response
        if (response) {
            await fb.sendMessage(threadID, response);
        }
    } catch (error) {
        console.error('Error handling command:', error);
        await fb.sendMessage(threadID, formatText('❌ An error occurred while processing your command.'));
    }
}

// Start bot
async function startBot() {
    try {
        // Initialize Facebook API
        const initialized = await fb.initialize();
        if (!initialized) {
            console.error('Failed to initialize Facebook API');
            process.exit(1);
        }

        // Start listening for messages
        fb.listen(handleCommand);
        console.log('Bot is now running!');
    } catch (error) {
        console.error('Error starting bot:', error);
        process.exit(1);
    }
}

// Start the bot
startBot(); 