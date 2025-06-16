const login = require('facebook-chat-api');
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const path = require('path');

class FacebookAPI {
    constructor() {
        this.api = null;
        this.appstatePath = path.join(__dirname, '../../appstate.json');
        this.isLoggedIn = false;
    }

    async initialize() {
        try {
            console.log('📱 Starting Facebook login process...');
            
            // Check if appstate exists
            if (fs.existsSync(this.appstatePath)) {
                console.log('📱 Found appstate.json, attempting to login...');
                const appstate = await fs.readJson(this.appstatePath);
                this.api = await this.loginWithAppstate(appstate);
            } else {
                console.log('❌ No appstate.json found. Please provide your Facebook credentials.');
                this.api = await this.loginWithCredentials();
            }

            if (this.api) {
                this.isLoggedIn = true;
                console.log('✅ Successfully logged in to Facebook!');
                
                // Try to get user info, but do not fail if it errors
                try {
                    const userInfo = await this.getUserInfo();
                    if (userInfo && userInfo.name && userInfo.id) {
                        console.log(`👤 Logged in as: ${userInfo.name} (${userInfo.id})`);
                    } else {
                        console.warn('⚠️ Could not fetch user info. The bot will still run.');
                    }
                } catch (err) {
                    console.warn('⚠️ Could not fetch user info. The bot will still run.');
                }
                
                // No event handlers needed; facebook-chat-api does not support .on
                return true;
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return false;
        }
    }

    async loginWithAppstate(appstate) {
        return new Promise((resolve, reject) => {
            login({ appState: appstate }, (err, api) => {
                if (err) {
                    console.error('❌ Appstate login failed:', err);
                    reject(err);
                    return;
                }
                resolve(api);
            });
        });
    }

    async loginWithCredentials() {
        return new Promise((resolve, reject) => {
            const email = process.env.FB_EMAIL;
            const password = process.env.FB_PASSWORD;

            if (!email || !password) {
                console.error('❌ Facebook credentials not found in .env file');
                reject(new Error('Missing credentials'));
                return;
            }

            login({ email, password }, (err, api) => {
                if (err) {
                    console.error('❌ Login failed:', err);
                    reject(err);
                    return;
                }

                // Save appstate
                fs.writeJson(this.appstatePath, api.getAppState())
                    .then(() => console.log('✅ Appstate saved successfully!'))
                    .catch(err => console.error('❌ Error saving appstate:', err));

                resolve(api);
            });
        });
    }

    async getUserInfo() {
        return new Promise((resolve, reject) => {
            if (!this.api) {
                reject(new Error('API not initialized'));
                return;
            }

            this.api.getUserInfo(this.api.getCurrentUserID(), (err, info) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(info[this.api.getCurrentUserID()]);
            });
        });
    }

    async sendMessage(threadID, message) {
        if (!this.api || !this.isLoggedIn) {
            console.error('❌ API not initialized or not logged in');
            return false;
        }

        try {
            console.log(`📤 Sending message to thread ${threadID}`);
            await this.api.sendMessage(message, threadID);
            console.log('✅ Message sent successfully');
            return true;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            return false;
        }
    }

    listen(callback) {
        if (!this.api || !this.isLoggedIn) {
            console.error('❌ API not initialized or not logged in');
            return;
        }

        console.log('👂 Listening for messages...');
        
        this.api.listen((err, message) => {
            if (err) {
                console.error('❌ Listen error:', err);
                return;
            }

            if (message && message.body) {
                console.log(`📥 Received message in thread ${message.threadID}: ${message.body}`);
                callback(message);
            }
        });
    }

    isGroupChat(threadID) {
        return threadID.toString().length > 15;
    }
}

module.exports = { FacebookAPI }; 