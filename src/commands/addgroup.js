class AddGroupCommand {
    constructor() {
        this.name = 'addgroup';
        this.description = 'Add a group (admin only)';
    }

    async execute(args, context) {
        return "Add group command executed (admin only)!";
    }
}

module.exports = AddGroupCommand; 