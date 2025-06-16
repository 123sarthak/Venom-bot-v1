class HelpCommand {
    constructor() {
        this.name = 'help';
        this.description = 'Shows help information';
    }

    async execute(args, context) {
        return "This is the help command. List your help info here!";
    }
}

module.exports = HelpCommand; 