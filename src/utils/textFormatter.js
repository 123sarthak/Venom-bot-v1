const { TEXT_STYLES } = require('../config/botConfig');

const VENOM_ASCII_ART = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗         ║
║  ██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║         ║
║  ██║   ██║█████╗  ██╔██╗ ██║██║   ██║██╔████╔██║         ║
║  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║         ║
║   ╚████╔╝ ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║         ║
║    ╚═══╝  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝         ║
║                                                            ║
║  ╔══════════════════════════════════════════════════════╗  ║
║  ║                 DEVELOPER INFO                       ║  ║
║  ╚══════════════════════════════════════════════════════╝  ║
║                                                            ║
║  👤 Name: Sarthak                                        ║
║  💻 Role: Full Stack Developer                           ║
║  🌐 GitHub: github.com/123sarthak                        ║
║  🎯 Skills: JavaScript, Node.js, React, Python, SQL      ║
║  💡 Motto: Code, Create, Innovate                        ║
║                                                            ║
║  ╔══════════════════════════════════════════════════════╗  ║
║  ║                 BOT INFO                             ║  ║
║  ╚══════════════════════════════════════════════════════╝  ║
║                                                            ║
║  📱 Version: 1.0.0                                       ║
║  ⚡ Prefix: !                                            ║
║  🎮 Games: TicTacToe                                     ║
║  🛠️ Utilities: Download, Broadcast                       ║
║                                                            ║
║  ╔══════════════════════════════════════════════════════╗  ║
║  ║                 ADMIN INFO                           ║  ║
║  ╚══════════════════════════════════════════════════════╝  ║
║                                                            ║
║  👑 Total Admins: 2                                      ║
║  🔑 Admin IDs:                                           ║
║     • 123456789                                          ║
║     • 987654321                                          ║
║                                                            ║
║  ╔══════════════════════════════════════════════════════╗  ║
║  ║                 CONTACT INFO                         ║  ║
║  ╚══════════════════════════════════════════════════════╝  ║
║                                                            ║
║  📧 Email: sarthak@example.com                           ║
║  💬 Discord: sarthak#1234                                ║
║  📱 Telegram: @sarthak                                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`;

const DEVELOPER_INFO = {
    name: "Sarthak",
    role: "Full Stack Developer",
    github: "github.com/123sarthak",
    email: "sarthak@example.com",
    discord: "sarthak#1234",
    telegram: "@sarthak",
    skills: ["JavaScript", "Node.js", "React", "Python", "SQL"],
    motto: "Code, Create, Innovate"
};

function formatText(text) {
    // Add emoji spacing
    text = text.replace(/([^\s])([^\s])([^\s])/g, '$1 $2 $3');
    
    // Add line breaks for better readability
    text = text.replace(/\. /g, '.\n');
    
    return text;
}

function createInfoMessage(adminIds) {
    return VENOM_ASCII_ART;
}

module.exports = {
    formatText,
    createInfoMessage,
    VENOM_ASCII_ART,
    DEVELOPER_INFO
}; 