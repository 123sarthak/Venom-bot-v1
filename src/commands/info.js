const { formatText, formatHelpText } = require('../utils/textFormatter');
const { TEXT_STYLES } = require('../config/botConfig');

const commands = {
    help: {
        description: 'Shows all available commands',
        usage: '!help [command]',
        example: '!help about',
        execute: async (args, { threadID, senderID, isAdmin }) => {
            if (args.length > 0) {
                const command = args[0].toLowerCase();
                const cmdInfo = commands[command];
                if (cmdInfo) {
                    return formatHelpText(
                        `!${command}`,
                        cmdInfo.description,
                        cmdInfo.usage,
                        cmdInfo.example
                    );
                }
                return formatText(`❌ Command "${command}" not found. Use !help to see all commands.`);
            }

            let helpText = formatText('🤖 *Venom Bot Commands*\n\n');
            
            // Info Commands
            helpText += formatText('📚 *Info Commands:*\n');
            helpText += formatHelpText('!help', 'Shows all available commands', '!help [command]');
            helpText += formatHelpText('!about', 'Shows information about the bot', '!about');
            helpText += formatHelpText('!stats', 'Shows bot statistics (Admin only)', '!stats');

            // Admin Commands
            if (isAdmin) {
                helpText += '\n' + formatText('👑 *Admin Commands:*\n');
                helpText += formatHelpText('!broadcast', 'Broadcasts a message to all groups', '!broadcast <message>');
            }

            return helpText;
        }
    },

    about: {
        description: 'Shows information about the bot',
        usage: '!about',
        execute: async () => {
            const aboutText = formatText(
                '🤖 *Venom Bot*\n\n' +
                'A powerful Facebook Messenger bot with various features.\n\n' +
                '📝 *Features:*\n' +
                '• Command handling with prefix\n' +
                '• Admin commands\n' +
                '• Group chat support\n\n' +
                '👨‍💻 *Developer:* Sarthak\n' +
                '🌐 *Version:* 1.0.0\n\n' +
                'Use !help to see all available commands.'
            );
            return aboutText;
        }
    },

    stats: {
        description: 'Shows bot statistics (Admin only)',
        usage: '!stats',
        execute: async ({ threadID, senderID, isAdmin }) => {
            if (!isAdmin) {
                return formatText('❌ This command is only available to admins.');
            }

            // You can add more statistics here
            const stats = {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: '1.0.0'
            };

            const statsText = formatText(
                '📊 *Bot Statistics*\n\n' +
                `⏱️ *Uptime:* ${Math.floor(stats.uptime / 3600)}h ${Math.floor((stats.uptime % 3600) / 60)}m\n` +
                `💾 *Memory Usage:* ${Math.round(stats.memory.heapUsed / 1024 / 1024)}MB\n` +
                `📦 *Version:* ${stats.version}\n\n` +
                'Last updated: ' + new Date().toLocaleString()
            );

            return statsText;
        }
    },

    info: {
        description: 'Shows information about the developer',
        usage: '!info',
        execute: async () => {
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

            const infoText = formatText(`${asciiArt}
╔════════════════════════════════════════════════════════════╗
║                    𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁 𝙸𝙽𝙵𝙾                    ║
╚════════════════════════════════════════════════════════════╝

👨‍💻 *Developer Information*

• 𝗡𝗮𝗺𝗲: Sarthak
• 𝗥𝗼𝗹𝗲: Bot Developer
• 𝗦𝗸𝗶𝗹𝗹𝘀: JavaScript, Node.js, API Integration

🎯 *About Me*
I am a passionate developer who loves creating
useful and fun bots for Facebook Messenger.
This bot is one of my projects to help make
group chats more interactive and enjoyable!

🛠️ *Technologies Used*
• Node.js
• Facebook Chat API
• Express.js
• SQLite Database

🌟 *Bot Features*
• Command System with Prefix
• Tic Tac Toe Game
• Video Downloader
• Admin Commands
• Group Chat Support

📱 *Connect With Me*
• GitHub: github.com/123sarthak
• Facebook: Sarthak

💫 *Special Thanks*
Thanks to everyone who uses and supports
this bot! Your feedback helps make it better.

╔════════════════════════════════════════════════════════════╗
║                    𝙱𝙾𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽 𝟷.𝟶.𝟶                    ║
╚════════════════════════════════════════════════════════════╝`);

            return infoText;
        }
    }
};

module.exports = commands; 