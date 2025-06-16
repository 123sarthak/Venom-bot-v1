class ListGroupsCommand {
    constructor() {
        this.name = 'listgroups';
        this.description = 'List all groups (admin only)';
    }

    async execute(args, context) {
        return "List groups command executed (admin only)!";
    }
}

module.exports = ListGroupsCommand; 