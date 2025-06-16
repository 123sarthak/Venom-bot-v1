const { TEXT_STYLES } = require('../config/botConfig');

const VENOM_ASCII_ART = `
██╗   ██╗███████╗███╗   ██╗ ██████╗ ███╗   ███╗
██║   ██║██╔════╝████╗  ██║██╔═══██╗████╗ ████║
██║   ██║█████╗  ██╔██╗ ██║██║   ██║██╔████╔██║
╚██╗ ██╔╝██╔══╝  ██║╚██╗██║██║   ██║██║╚██╔╝██║
 ╚████╔╝ ███████╗██║ ╚████║╚██████╔╝██║ ╚═╝ ██║
  ╚═══╝  ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝     ╚═╝
`;

const DEVELOPER_INFO = {
    name: "Sarthak",
    role: "Full Stack Developer",
    github: "github.com/123sarthak",
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
    const { name, role, github, skills, motto } = DEVELOPER_INFO;
    
    return `${VENOM_ASCII_ART}

${formatText('Developer Information', TEXT_STYLES.HEADER)}
${formatText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', TEXT_STYLES.CODE)}

${formatText('Name', TEXT_STYLES.SUBHEADER)}: ${formatText(name, TEXT_STYLES.BOLD)}
${formatText('Role', TEXT_STYLES.SUBHEADER)}: ${formatText(role, TEXT_STYLES.ITALIC)}
${formatText('GitHub', TEXT_STYLES.SUBHEADER)}: ${formatText(github, TEXT_STYLES.CODE)}
${formatText('Motto', TEXT_STYLES.SUBHEADER)}: ${formatText(motto, TEXT_STYLES.ITALIC)}

${formatText('Skills', TEXT_STYLES.SUBHEADER)}:
${skills.map(skill => `  • ${formatText(skill, TEXT_STYLES.CODE)}`).join('\n')}

${formatText('Bot Information', TEXT_STYLES.HEADER)}
${formatText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', TEXT_STYLES.CODE)}

${formatText('Version', TEXT_STYLES.SUBHEADER)}: ${formatText('1.0.0', TEXT_STYLES.CODE)}
${formatText('Prefix', TEXT_STYLES.SUBHEADER)}: ${formatText('!', TEXT_STYLES.CODE)}
${formatText('Commands', TEXT_STYLES.SUBHEADER)}: ${formatText('!help', TEXT_STYLES.CODE)}

${formatText('Admin Information', TEXT_STYLES.HEADER)}
${formatText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', TEXT_STYLES.CODE)}

${formatText('Total Admins', TEXT_STYLES.SUBHEADER)}: ${formatText(adminIds.length.toString(), TEXT_STYLES.CODE)}
${formatText('Admin IDs', TEXT_STYLES.SUBHEADER)}:
${adminIds.map(id => `  • ${formatText(id, TEXT_STYLES.CODE)}`).join('\n')}

${formatText('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', TEXT_STYLES.CODE)}
${formatText('Made with ❤️ by Sarthak', TEXT_STYLES.DEV)}`;
}

module.exports = {
    formatText,
    createInfoMessage,
    VENOM_ASCII_ART,
    DEVELOPER_INFO
}; 