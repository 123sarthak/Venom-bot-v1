class ListGroupsCommand {
    constructor() {
        this.name = 'listgroups';
        this.description = 'List all groups where bot is active (Admin only)';
    }

    async execute(args, context) {
        const { isAdmin } = context;
        
        if (!isAdmin) {
            return `❌ **Access Denied!**
            
**👑 This command is for admins only.**
You don't have permission to use this command.`;
        }

        try {
            // This would be implemented with actual database logic
            // For now, just return a placeholder response
            const groups = [
                { id: '123456789', name: 'Test Group 1', members: 50 },
                { id: '987654321', name: 'Test Group 2', members: 30 },
                { id: '456789123', name: 'Test Group 3', members: 25 }
            ];

            let groupsText = `📋 **Active Groups List**
            
**👑 Admin Command:** Showing all groups where the bot is active.

**📊 Total Groups:** ${groups.length}`;

            groups.forEach((group, index) => {
                groupsText += `\n\n**${index + 1}. ${group.name}**
• **ID:** ${group.id}
• **Members:** ${group.members}`;
            });

            groupsText += `

**💡 Use !addgroup to add a group or !removegroup to remove one.**`;

            return groupsText;
        } catch (error) {
            return `❌ **Failed to List Groups!**
            
**❌ Error:** ${error.message}

**💡 Try again later or contact the developer.`;
        }
    }
}

module.exports = ListGroupsCommand; 