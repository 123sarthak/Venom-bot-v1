const { BOT_INFO, COMMAND_CATEGORIES, TEXT_STYLES, ADMIN_IDS } = require('../config/botConfig');
const infoCommands = require('../commands/info');
const adminCommands = require('../commands/admin');
const { formatText } = require('../utils/textFormatter');

// Combine all commands
const commands = {
    ...infoCommands,
    ...adminCommands
};

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.categories = new Map();
        this.initializeCategories();
        this.registerDefaultCommands();
    }

    initializeCategories() {
        Object.values(COMMAND_CATEGORIES).forEach(category => {
            this.categories.set(category, new Map());
        });
    }

    registerDefaultCommands() {
        // Register info commands
        Object.entries(infoCommands).forEach(([command, info]) => {
            this.registerCommand(command, info.execute, COMMAND_CATEGORIES.GENERAL);
        });

        // Register admin commands
        Object.entries(adminCommands).forEach(([command, info]) => {
            this.registerCommand(command, info.execute, COMMAND_CATEGORIES.ADMIN, true);
        });
    }

    registerCommand(command, handler, category, isAdmin = false) {
        this.commands.set(command, { handler, category, isAdmin });
        if (!this.categories.has(category)) {
            this.categories.set(category, new Map());
        }
        this.categories.get(category).set(command, { handler, isAdmin });
    }

    async handleCommand(senderId, command, args) {
        // If no command provided, return help message
        if (!command) {
            return this.getHelpMessage();
        }

        const commandInfo = this.commands.get(command);
        
        if (!commandInfo) {
            return formatText(`❌ Unknown command "${command}". Use ${TEXT_STYLES.COMMAND}help to see available commands.`);
        }

        if (commandInfo.isAdmin && !ADMIN_IDS.includes(senderId.toString())) {
            return formatText("⛔ You don't have permission to use this command.");
        }

        try {
            const response = await commandInfo.handler(args, { senderId });
            return response ? formatText(response) : null;
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
            return formatText("❌ An error occurred while executing the command.");
        }
    }

    getHelpMessage() {
        let helpMessage = formatText(`${TEXT_STYLES.BOT_NAME} - Command List\n\n`);
        
        for (const [category, commands] of this.categories) {
            if (commands.size > 0) {
                helpMessage += formatText(`${category}:\n`);
                for (const [cmd, info] of commands) {
                    const adminBadge = info.isAdmin ? ` ${TEXT_STYLES.ADMIN}` : '';
                    helpMessage += formatText(`• ${TEXT_STYLES.COMMAND}${cmd}${adminBadge}\n`);
                }
                helpMessage += '\n';
            }
        }

        helpMessage += formatText(`\n${TEXT_STYLES.BOT_NAME} v${BOT_INFO.version}\n`);
        helpMessage += formatText(`Created by ${BOT_INFO.creator}`);
        
        return helpMessage;
    }

    getAboutMessage() {
        const asciiArt = `
    ███████╗ █████╗ ██████╗ ████████╗██╗  ██╗ █████╗ ██╗  ██╗
    ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██╔══██╗██║ ██╔╝
    ███████╗███████║██████╔╝   ██║   ███████║███████║█████╔╝ 
    ╚════██║██╔══██║██╔══██╗   ██║   ██╔══██║██╔══██║██╔═██╗ 
    ███████║██║  ██║██║  ██║   ██║   ██║  ██║██║  ██║██║  ██╗
    ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
    ██████╗  ██████╗ ████████╗
    ██╔══██╗██╔═══██╗╚══██╔══╝
    ██████╔╝██║   ██║   ██║   
    ██╔══██╗██║   ██║   ██║   
    ██████╔╝╚██████╔╝   ██║   
    ╚═════╝  ╚═════╝    ╚═╝   
    `;

        return formatText(`${asciiArt}
╔════════════════════════════════════════════════════════════╗
║                    ${TEXT_STYLES.BOT_NAME}                    ║
╚════════════════════════════════════════════════════════════╝

🌟 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗺𝘆 𝗯𝗼𝘁! 🌟

📱 𝗕𝗼𝘁 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻:
• 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${BOT_INFO.version}
• 𝗖𝗿𝗲𝗮𝘁𝗼𝗿: ${BOT_INFO.creator}

📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻:
${BOT_INFO.description}

✨ 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀:
${BOT_INFO.features.map(feature => `• ${feature}`).join('\n')}

🎮 𝗛𝗼𝘄 𝘁𝗼 𝘂𝘀𝗲:
• Type ${TEXT_STYLES.COMMAND}help to see all commands
• Type ${TEXT_STYLES.COMMAND} followed by a command to use it
• Example: ${TEXT_STYLES.COMMAND}tictactoe to start a game

╔════════════════════════════════════════════════════════════╗
║                      𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁                      ║
║ • ${TEXT_STYLES.COMMAND}help    - Show all commands          ║
║ • ${TEXT_STYLES.COMMAND}about   - Show this message          ║
║ • ${TEXT_STYLES.COMMAND}game    - Play Tic Tac Toe          ║
║ • ${TEXT_STYLES.COMMAND}download - Download videos           ║
╚════════════════════════════════════════════════════════════╝

💫 𝗘𝗻𝗷𝗼𝘆 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗯��𝘁! 💫`);
    }
}

async function handleCommand(command, args, context) {
    const { threadID, senderID, isAdmin, api } = context;

    // Add api to context for commands that need it
    const commandContext = { ...context, api };

    // Check if command exists
    if (!commands[command]) {
        return null; // Command not found
    }

    try {
        // Execute command
        const response = await commands[command].execute(args, commandContext);
        return response;
    } catch (error) {
        console.error(`Error executing command ${command}:`, error);
        return '❌ An error occurred while executing the command.';
    }
}

module.exports = {
    handleCommand,
    commands,
    CommandHandler
}; 