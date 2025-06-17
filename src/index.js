require('dotenv').config();
const { FacebookAPI } = require('./utils/facebookApi');
const { formatText } = require('./utils/textFormatter');
const { PREFIX, ADMIN_IDS } = require('./config/botConfig');
const TicTacToe = require('./games/tictactoe');
const WelcomeHandler = require('./handlers/welcomeHandler');

// Initialize Facebook API
const fb = new FacebookAPI();

// Initialize games
const tictactoe = new TicTacToe();

// Initialize welcome handler
const welcomeHandler = new WelcomeHandler();

// Import all commands
const InfoCommand = require('./commands/info');
const HelpCommand = require('./commands/help');
const AboutCommand = require('./commands/about');
const StatsCommand = require('./commands/stats');
const DownloadCommand = require('./commands/download');
const BroadcastCommand = require('./commands/broadcast');
const AddGroupCommand = require('./commands/addgroup');
const RemoveGroupCommand = require('./commands/removegroup');
const ListGroupsCommand = require('./commands/listgroups');

// Initialize commands
const infoCommand = new InfoCommand();
const helpCommand = new HelpCommand();
const aboutCommand = new AboutCommand();
const statsCommand = new StatsCommand();
const downloadCommand = new DownloadCommand();
const broadcastCommand = new BroadcastCommand();
const addGroupCommand = new AddGroupCommand();
const removeGroupCommand = new RemoveGroupCommand();
const listGroupsCommand = new ListGroupsCommand();

// Command handler
async function handleCommand(message) {
    const { threadID, senderID, body } = message;
    const isAdmin = ADMIN_IDS.includes(senderID);

    // Check if message starts with prefix
    if (!body.startsWith(PREFIX)) return;

    // Split command and arguments
    const [cmd, ...args] = body.slice(PREFIX.length).trim().split(' ');

    // If only prefix is used (no command), send default message
    if (!cmd || cmd === '') {
        const defaultMessage = `🤖 **Command ta lekha babu!** 🤖

**💡 Usage:** !<command>

**🎯 Popular Commands:**
• !help - Show all commands
• !info - Bot information
• !tictactoe - Play a game
• !about - About the bot

**💭 Example:** !help

**🎮 Try:** !tictactoe to start a fun game!`;

        await fb.sendMessage(threadID, defaultMessage);
        return;
    }

    try {
        let response;

        // Handle commands
        switch (cmd.toLowerCase()) {
            case 'tictactoe':
                if (args.length === 0) {
                    response = tictactoe.startGame(senderID);
                } else {
                    response = tictactoe.makeMove(senderID, args[0]);
                }
                break;

            case 'info':
                response = await infoCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'help':
                response = await helpCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'about':
                response = await aboutCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'stats':
                response = await statsCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'download':
                response = await downloadCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'broadcast':
                response = await broadcastCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'addgroup':
                response = await addGroupCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'removegroup':
                response = await removeGroupCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            case 'listgroups':
                response = await listGroupsCommand.execute(args, { threadID, senderID, isAdmin });
                break;

            default:
                response = formatText(`❌ **Unknown command:** ${cmd}

**💡 Use !help to see all available commands!**`);
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

// Message handler for all types of messages
async function handleMessage(message) {
    const { threadID, senderID, body, type, logMessageType, logMessageData } = message;

    // Handle commands
    if (body && body.startsWith(PREFIX)) {
        await handleCommand(message);
        return;
    }

    // Handle welcome/goodbye messages
    if (type === 'log:subscribe' || logMessageType === 'log:subscribe') {
        // Someone joined the group
        const addedParticipants = logMessageData?.addedParticipants || [];
        for (const participant of addedParticipants) {
            const userName = participant.fullName || 'New Member';
            await welcomeHandler.handleWelcome(threadID, participant.userFbId, userName, fb);
        }
    } else if (type === 'log:unsubscribe' || logMessageType === 'log:unsubscribe') {
        // Someone left the group
        const leftParticipant = logMessageData?.leftParticipant;
        if (leftParticipant) {
            const userName = leftParticipant.fullName || 'Member';
            await welcomeHandler.handleGoodbye(threadID, leftParticipant.userFbId, userName, fb);
        }
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
        fb.listen(handleMessage);
        console.log('🤖 Bot is now running with all features!');
        console.log('📋 Available commands: help, info, about, stats, tictactoe, download, broadcast, addgroup, removegroup, listgroups');
        console.log('👋 Welcome/Goodbye messages are active!');
    } catch (error) {
        console.error('Error starting bot:', error);
        process.exit(1);
    }
}

// Start the bot
startBot(); 