const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, '../../data/bot.db');
        this.db = null;
    }

    async initialize() {
        try {
            // Ensure data directory exists
            await fs.ensureDir(path.dirname(this.dbPath));
            
            // Initialize database connection
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ Database connection error:', err);
                    throw err;
                }
                console.log('✅ Connected to SQLite database');
            });

            // Create necessary tables
            await this.createTables();
            return true;
        } catch (error) {
            console.error('❌ Database initialization error:', error);
            return false;
        }
    }

    async createTables() {
        const tables = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                username TEXT,
                is_admin INTEGER DEFAULT 0,
                join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
                message_count INTEGER DEFAULT 0
            )`,

            // Groups table
            `CREATE TABLE IF NOT EXISTS groups (
                group_id TEXT PRIMARY KEY,
                group_name TEXT,
                is_broadcast INTEGER DEFAULT 0,
                join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
                message_count INTEGER DEFAULT 0
            )`,

            // Commands table
            `CREATE TABLE IF NOT EXISTS commands (
                command_id INTEGER PRIMARY KEY AUTOINCREMENT,
                command_name TEXT NOT NULL,
                usage_count INTEGER DEFAULT 0,
                last_used DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,

            // Settings table
            `CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const table of tables) {
            await this.run(table);
        }
    }

    // Helper method to run SQL queries
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('❌ Database query error:', err);
                    reject(err);
                    return;
                }
                resolve(this);
            });
        });
    }

    // Helper method to get a single row
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('❌ Database query error:', err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    // Helper method to get multiple rows
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('❌ Database query error:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    // User management methods
    async addUser(userId, username) {
        const sql = `INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)`;
        await this.run(sql, [userId, username]);
    }

    async updateUserActivity(userId) {
        const sql = `UPDATE users SET last_active = CURRENT_TIMESTAMP, message_count = message_count + 1 WHERE user_id = ?`;
        await this.run(sql, [userId]);
    }

    async getUserStats(userId) {
        return await this.get('SELECT * FROM users WHERE user_id = ?', [userId]);
    }

    // Group management methods
    async addGroup(groupId, groupName) {
        const sql = `INSERT OR IGNORE INTO groups (group_id, group_name) VALUES (?, ?)`;
        await this.run(sql, [groupId, groupName]);
    }

    async updateGroupActivity(groupId) {
        const sql = `UPDATE groups SET last_active = CURRENT_TIMESTAMP, message_count = message_count + 1 WHERE group_id = ?`;
        await this.run(sql, [groupId]);
    }

    async setBroadcastGroup(groupId, isBroadcast) {
        const sql = `UPDATE groups SET is_broadcast = ? WHERE group_id = ?`;
        await this.run(sql, [isBroadcast ? 1 : 0, groupId]);
    }

    async getBroadcastGroups() {
        return await this.all('SELECT * FROM groups WHERE is_broadcast = 1');
    }

    // Command tracking methods
    async trackCommand(commandName) {
        const sql = `INSERT INTO commands (command_name, usage_count, last_used) 
                    VALUES (?, 1, CURRENT_TIMESTAMP)
                    ON CONFLICT(command_name) 
                    DO UPDATE SET usage_count = usage_count + 1, last_used = CURRENT_TIMESTAMP`;
        await this.run(sql, [commandName]);
    }

    async getCommandStats() {
        return await this.all('SELECT * FROM commands ORDER BY usage_count DESC');
    }

    // Settings management methods
    async setSetting(key, value) {
        const sql = `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
        await this.run(sql, [key, value]);
    }

    async getSetting(key) {
        const result = await this.get('SELECT value FROM settings WHERE key = ?', [key]);
        return result ? result.value : null;
    }

    // Statistics methods
    async getBotStats() {
        const stats = {
            users: await this.get('SELECT COUNT(*) as count FROM users'),
            groups: await this.get('SELECT COUNT(*) as count FROM groups'),
            broadcastGroups: await this.get('SELECT COUNT(*) as count FROM groups WHERE is_broadcast = 1'),
            totalMessages: await this.get('SELECT SUM(message_count) as count FROM users'),
            commands: await this.get('SELECT COUNT(*) as count FROM commands'),
            topCommands: await this.all('SELECT command_name, usage_count FROM commands ORDER BY usage_count DESC LIMIT 5')
        };
        return stats;
    }

    // Close database connection
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        console.error('❌ Error closing database:', err);
                        reject(err);
                        return;
                    }
                    console.log('✅ Database connection closed');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = { Database }; 