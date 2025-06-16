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

function formatText(text, style) {
    switch (style) {
        case TEXT_STYLES.BOLD:
            return `*${text}*`;
        case TEXT_STYLES.ITALIC:
            return `_${text}_`;
        case TEXT_STYLES.CODE:
            return `\`${text}\``;
        case TEXT_STYLES.HEADER:
            return `📌 ${text}`;
        case TEXT_STYLES.SUBHEADER:
            return `➡️ ${text}`;
        case TEXT_STYLES.SUCCESS:
            return `✅ ${text}`;
        case TEXT_STYLES.ERROR:
            return `❌ ${text}`;
        case TEXT_STYLES.WARNING:
            return `⚠️ ${text}`;
        case TEXT_STYLES.INFO:
            return `ℹ️ ${text}`;
        case TEXT_STYLES.DEV:
            return `👨‍💻 ${text}`;
        case TEXT_STYLES.ADMIN:
            return `👑 ${text}`;
        default:
            return text;
    }
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