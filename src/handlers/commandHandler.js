const { BOT_INFO, COMMAND_CATEGORIES, TEXT_STYLES, ADMIN_IDS } = require('../config/botConfig');
const infoCommands = require('../commands/info');
const adminCommands = require('../commands/admin');

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
    }

    initializeCategories() {
        Object.values(COMMAND_CATEGORIES).forEach(category => {
            this.categories.set(category, new Map());
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
        const commandInfo = this.commands.get(command);
        
        if (!commandInfo) {
            return `Unknown command. Use ${TEXT_STYLES.COMMAND}help to see available commands.`;
        }

        if (commandInfo.isAdmin && !ADMIN_IDS.includes(senderId)) {
            return "⛔ You don't have permission to use this command.";
        }

        try {
            return await commandInfo.handler(senderId, args);
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
            return "❌ An error occurred while executing the command.";
        }
    }

    getHelpMessage() {
        let helpMessage = `${TEXT_STYLES.BOT_NAME} - Command List\n\n`;
        
        for (const [category, commands] of this.categories) {
            if (commands.size > 0) {
                helpMessage += `${category}:\n`;
                for (const [cmd, info] of commands) {
                    const adminBadge = info.isAdmin ? ` ${TEXT_STYLES.ADMIN}` : '';
                    helpMessage += `• ${TEXT_STYLES.COMMAND}${cmd}${adminBadge}\n`;
                }
                helpMessage += '\n';
            }
        }

        helpMessage += `\n${TEXT_STYLES.BOT_NAME} v${BOT_INFO.version}\n`;
        helpMessage += `Created by ${BOT_INFO.creator}`;
        
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

        return `${asciiArt}
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

💫 𝗘𝗻𝗷𝗼𝘆 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗯𝗼𝘁! 💫

    [${TEXT_STYLES.BOT_NAME} - Version ${BOT_INFO.version}]
    `;
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