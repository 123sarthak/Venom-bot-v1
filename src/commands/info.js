const { formatText } = require('../utils/textFormatter');

class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `
╔════════════════════════════════════════════════════════════════════════════╗
║ 🎮 VENOM BOT INFORMATION                                                   ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║ 👨‍💻 DEVELOPER INFORMATION                                                 ║
║ • Name: Sarthak                                                           ║
║ • Role: Bot Developer                                                      ║
║ • Contact: sarthak@example.com                                           ║
║                                                                            ║
║ 🤖 BOT FEATURES                                                            ║
║ • Games: Tic Tac Toe, Rock Paper Scissors                                 ║
║ • Fun: 8ball, Roll, Flip                                                  ║
║ • Utility: Info, Help, Ping                                               ║
║                                                                            ║
║ 👑 ADMIN COMMANDS                                                          ║
║ • !admin - Show admin commands                                            ║
║ • !broadcast - Send message to all users                                  ║
║ • !restart - Restart the bot                                              ║
║                                                                            ║
║ 📞 CONTACT                                                                ║
║ • Facebook: facebook.com/sarthak                                         ║
║ • Email: sarthak@example.com                                            ║
║ • GitHub: github.com/sarthak                                            ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`;

        return formatText(infoText);
    }
}

module.exports = InfoCommand; 