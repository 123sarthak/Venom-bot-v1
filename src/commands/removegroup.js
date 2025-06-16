class RemoveGroupCommand {
    constructor() {
        this.name = 'removegroup';
        this.description = 'Remove a group (admin only)';
    }

    async execute(args, context) {
        return "Remove group command executed (admin only)!";
    }
}

module.exports = RemoveGroupCommand; 