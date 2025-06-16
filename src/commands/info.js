class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `ꜱᴀʀᴛʜᴀᴋ'ꜱ ʙᴏᴛ - Command List

🎯 General Commands:
• !help
• !about
• !stats
• !info

🎮 Game Commands:
• !tictactoe

🛠️ Utility Commands:
• !download

👑 Admin Commands:
• !broadcast 👑 ᴀᴅᴍɪɴ
• !addgroup 👑 ᴀᴅᴍɪɴ
• !removegroup 👑 ᴀᴅᴍɪɴ
• !listgroups 👑 ᴀᴅᴍɪɴ
• !stats 👑 ᴀᴅᴍɪɴ

ꜱᴀʀᴛʜᴀᴋ'ꜱ ʙᴏᴛ v1.0.0
Created by Sarthak`;

        return infoText;
    }
}

module.exports = InfoCommand; 