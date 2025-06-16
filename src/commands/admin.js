const { formatText } = require('../utils/textFormatter');

// Store active groups for broadcasting
const activeGroups = new Set();

const commands = {
    broadcast: {
        description: 'Broadcasts a message to all groups (Admin only)',
        usage: '!broadcast <message>',
        example: '!broadcast Hello everyone!',
        execute: async (args, { threadID, senderID, isAdmin, api }) => {
            if (!isAdmin) {
                return formatText('❌ This command is only available to admins.');
            }

            if (args.length === 0) {
                return formatText('❌ Please provide a message to broadcast.');
            }

            const message = args.join(' ');
            const broadcastMessage = formatText(
                '📢 *Broadcast Message*\n\n' +
                message + '\n\n' +
                '— Sent by Admin'
            );

            try {
                // Add current group to active groups if not already present
                activeGroups.add(threadID);

                // Get all active groups
                const groups = Array.from(activeGroups);
                
                // Send message to all groups
                for (const groupId of groups) {
                    if (groupId !== threadID) { // Don't send to the group where command was used
                        await api.sendMessage(broadcastMessage, groupId);
                    }
                }

                return formatText(
                    `✅ Message broadcasted to ${groups.length - 1} groups.\n\n` +
                    '📝 *Message Preview:*\n' +
                    message
                );
            } catch (error) {
                console.error('Broadcast error:', error);
                return formatText('❌ Error broadcasting message. Please try again.');
            }
        }
    },

    // Command to add a group to broadcast list
    addgroup: {
        description: 'Adds current group to broadcast list (Admin only)',
        usage: '!addgroup',
        execute: async ({ threadID, senderID, isAdmin }) => {
            if (!isAdmin) {
                return formatText('❌ This command is only available to admins.');
            }

            if (activeGroups.has(threadID)) {
                return formatText('ℹ️ This group is already in the broadcast list.');
            }

            activeGroups.add(threadID);
            return formatText('✅ Group added to broadcast list.');
        }
    },

    // Command to remove a group from broadcast list
    removegroup: {
        description: 'Removes current group from broadcast list (Admin only)',
        usage: '!removegroup',
        execute: async ({ threadID, senderID, isAdmin }) => {
            if (!isAdmin) {
                return formatText('❌ This command is only available to admins.');
            }

            if (!activeGroups.has(threadID)) {
                return formatText('ℹ️ This group is not in the broadcast list.');
            }

            activeGroups.delete(threadID);
            return formatText('✅ Group removed from broadcast list.');
        }
    },

    // Command to list all groups in broadcast list
    listgroups: {
        description: 'Lists all groups in broadcast list (Admin only)',
        usage: '!listgroups',
        execute: async ({ senderID, isAdmin, api }) => {
            if (!isAdmin) {
                return formatText('❌ This command is only available to admins.');
            }

            if (activeGroups.size === 0) {
                return formatText('ℹ️ No groups in broadcast list.');
            }

            let groupList = formatText('📋 *Broadcast Groups:*\n\n');
            let index = 1;

            for (const groupId of activeGroups) {
                try {
                    // Get group info
                    const groupInfo = await api.getThreadInfo(groupId);
                    groupList += `${index}. ${groupInfo.name || 'Unknown Group'} (${groupId})\n`;
                    index++;
                } catch (error) {
                    console.error('Error getting group info:', error);
                    groupList += `${index}. Unknown Group (${groupId})\n`;
                    index++;
                }
            }

            return groupList;
        }
    }
};

module.exports = commands; 