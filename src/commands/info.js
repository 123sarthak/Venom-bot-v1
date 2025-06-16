const { formatText } = require('../utils/textFormatter');

class InfoCommand {
    constructor() {
        this.name = 'info';
        this.description = 'Shows information about the bot and developer';
    }

    async execute(args, context) {
        const infoText = `ꜱᴀʀᴛʜᴀᴋ'ꜱ ʙᴏᴛ - Command List

🎯 General Commands:
• !ᴄᴏᴍᴍᴀɴᴅhelp
• !ᴄᴏᴍᴍᴀɴᴅabout
• !ᴄᴏᴍᴍᴀɴᴅstats
• !ᴄᴏᴍᴍᴀɴᴅinfo

🎮 Game Commands:
• !ᴄᴏᴍᴍᴀɴᴅtictactoe

🛠️ Utility Commands:
• !ᴄᴏᴍᴍᴀɴᴅdownload

👑 Admin Commands:
• !ᴄᴏᴍᴍᴀɴᴅbroadcast 👑 ᴀᴅᴍɪɴ
• !ᴄᴏᴍᴍᴀɴᴅaddgroup 👑 ᴀᴅᴍɪɴ
• !ᴄᴏᴍᴍᴀɴᴅremovegroup 👑 ᴀᴅᴍɪɴ
• !ᴄᴏᴍᴍᴀɴᴅlistgroups 👑 ᴀᴅᴍɪɴ
• !ᴄᴏᴍᴍᴀɴᴅstats 👑 ᴀᴅᴍɪɴ

ꜱᴀʀᴛʜᴀᴋ'ꜱ ʙᴏᴛ v1.0.0
Created by Sarthak`;

        return formatText(infoText);
    }
}

module.exports = InfoCommand; 