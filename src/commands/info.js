const { formatText, formatHelpText } = require('../utils/textFormatter');

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
    }
};

module.exports = commands; 