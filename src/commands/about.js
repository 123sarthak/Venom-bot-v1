class AboutCommand {
    constructor() {
        this.name = 'about';
        this.description = 'Shows information about the bot';
    }

    async execute(args, context) {
        return "This is Sarthak's bot, version 1.0.0!";
    }
}

module.exports = AboutCommand; 