const TEXT_STYLES = {
    BOLD: '*',
    ITALIC: '_',
    CODE: '`',
    STRIKETHROUGH: '~',
    MONOSPACE: '```'
};

function formatText(text, style = '') {
    if (!text) return '';
    
    // Handle different style combinations
    switch (style.toLowerCase()) {
        case 'bold':
            return `${TEXT_STYLES.BOLD}${text}${TEXT_STYLES.BOLD}`;
        case 'italic':
            return `${TEXT_STYLES.ITALIC}${text}${TEXT_STYLES.ITALIC}`;
        case 'code':
            return `${TEXT_STYLES.CODE}${text}${TEXT_STYLES.CODE}`;
        case 'strikethrough':
            return `${TEXT_STYLES.STRIKETHROUGH}${text}${TEXT_STYLES.STRIKETHROUGH}`;
        case 'monospace':
            return `${TEXT_STYLES.MONOSPACE}${text}${TEXT_STYLES.MONOSPACE}`;
        case 'bold-italic':
            return `${TEXT_STYLES.BOLD}${TEXT_STYLES.ITALIC}${text}${TEXT_STYLES.ITALIC}${TEXT_STYLES.BOLD}`;
        case 'bold-code':
            return `${TEXT_STYLES.BOLD}${TEXT_STYLES.CODE}${text}${TEXT_STYLES.CODE}${TEXT_STYLES.BOLD}`;
        default:
            return text;
    }
}

function formatHelpText(command, description, usage = '', example = '') {
    let text = `${TEXT_STYLES.BOLD}${command}${TEXT_STYLES.BOLD}\n`;
    text += `${TEXT_STYLES.ITALIC}${description}${TEXT_STYLES.ITALIC}\n`;
    
    if (usage) {
        text += `Usage: ${TEXT_STYLES.CODE}${usage}${TEXT_STYLES.CODE}\n`;
    }
    
    if (example) {
        text += `Example: ${TEXT_STYLES.CODE}${example}${TEXT_STYLES.CODE}\n`;
    }
    
    return text;
}

function formatError(message) {
    return `${TEXT_STYLES.BOLD}❌ Error:${TEXT_STYLES.BOLD} ${message}`;
}

function formatSuccess(message) {
    return `${TEXT_STYLES.BOLD}✅ Success:${TEXT_STYLES.BOLD} ${message}`;
}

function formatWarning(message) {
    return `${TEXT_STYLES.BOLD}⚠️ Warning:${TEXT_STYLES.BOLD} ${message}`;
}

function formatInfo(message) {
    return `${TEXT_STYLES.BOLD}ℹ️ Info:${TEXT_STYLES.BOLD} ${message}`;
}

module.exports = {
    formatText,
    formatHelpText,
    formatError,
    formatSuccess,
    formatWarning,
    formatInfo,
    TEXT_STYLES
}; 