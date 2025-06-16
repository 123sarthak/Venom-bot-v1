const login = require('facebook-chat-api');
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const path = require('path');

class FacebookAPI {
    constructor() {
        this.api = null;
        this.appstatePath = path.join(__dirname, '../../appstate.json');
    }

    async initialize() {
        try {
            // Check if appstate exists
            if (fs.existsSync(this.appstatePath)) {
                console.log('📱 Loading appstate...');
                const appstate = await fs.readJson(this.appstatePath);
                this.api = await this.loginWithAppstate(appstate);
            } else {
                console.log('❌ No appstate found. Please provide your Facebook credentials.');
                this.api = await this.loginWithCredentials();
            }

            if (this.api) {
                console.log('✅ Successfully logged in to Facebook!');
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

    async sendMessage(threadID, message) {
        if (!this.api) {
            console.error('❌ API not initialized');
            return false;
        }

        try {
            await this.api.sendMessage(message, threadID);
            return true;
        } catch (error) {
            console.error('❌ Error sending message:', error);
            return false;
        }
    }

    listen(callback) {
        if (!this.api) {
            console.error('❌ API not initialized');
            return;
        }

        this.api.listen((err, message) => {
            if (err) {
                console.error('❌ Listen error:', err);
                return;
            }

            if (message && message.body) {
                callback(message);
            }
        });
    }
}

module.exports = { FacebookAPI }; 