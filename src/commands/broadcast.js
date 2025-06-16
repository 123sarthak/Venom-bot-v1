class BroadcastCommand {
    constructor() {
        this.name = 'broadcast';
        this.description = 'Broadcast a message to all users (admin only)';
    }

    async execute(args, context) {
        return "Broadcast command executed (admin only)!";
    }
}

module.exports = BroadcastCommand; 