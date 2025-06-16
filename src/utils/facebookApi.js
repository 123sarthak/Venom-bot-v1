const login = require('facebook-chat-api');

const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const path = require('path');

class FacebookAPI {
    constructor() {
        this.api = null;
        this.appStatePath = path.join(__dirname, '../../appstate.json');
        this.loginAttempts = 0;
        this.maxLoginAttempts = 3;
        this.retryDelay = 5000; // 5 seconds
    }

    async initialize() {
        try {
            console.log('🔑 Initializing Facebook API...');
            
            // Check if appstate.json exists
            if (await fs.pathExists(this.appStatePath)) {
                console.log('📂 Found appstate.json, attempting to login...');
                const appState = await fs.readJson(this.appStatePath);
                await this.loginWithAppstate(appState);
            } else {
                console.log('❌ No appstate.json found, attempting login with credentials...');
                await this.loginWithCredentials();
            }

            return true;
        } catch (error) {
            console.error('❌ Error initializing Facebook API:', error);
            return false;
        }
    }

    async loginWithAppstate(appState) {
        try {
            return new Promise((resolve, reject) => {
                login({ appState }, (err, api) => {
                    if (err) {
                        console.error('❌ Error logging in with appstate:', err);
                        if (err.error === 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in too frequently, or checking in too frequently.') {
                            console.log('🔄 Appstate expired, trying credentials login...');
                            this.loginWithCredentials()
                                .then(resolve)
                                .catch(reject);
                        } else {
                            reject(err);
                        }
                        return;
                    }

                    this.api = api;
                    console.log('✅ Successfully logged in with appstate');
                    resolve(api);
                });
            });
        } catch (error) {
            console.error('❌ Error in loginWithAppstate:', error);
            throw error;
        }
    }

    async loginWithCredentials() {
        if (this.loginAttempts >= this.maxLoginAttempts) {
            throw new Error('Maximum login attempts reached. Please try again later.');
        }

        const email = process.env.FB_EMAIL;
        const password = process.env.FB_PASSWORD;

        if (!email || !password) {
            throw new Error('Facebook credentials not found in environment variables.');
        }

        try {
            return new Promise((resolve, reject) => {
                login({ email, password }, (err, api) => {
                    if (err) {
                        console.error('❌ Error logging in with credentials:', err);
                        this.loginAttempts++;
                        
                        if (err.error === 'login-approval') {
                            console.log('⚠️ Login approval required. Please check your Facebook account.');
                            reject(new Error('Login approval required. Please check your Facebook account.'));
                        } else if (err.error === 'checkpoint') {
                            console.log('⚠️ Security checkpoint detected. Please check your Facebook account.');
                            reject(new Error('Security checkpoint detected. Please check your Facebook account.'));
                        } else {
                            setTimeout(() => {
                                this.loginWithCredentials()
                                    .then(resolve)
                                    .catch(reject);
                            }, this.retryDelay);
                        }
                        return;
                    }

                    this.api = api;
                    console.log('✅ Successfully logged in with credentials');
                    
                    // Save appstate
                    api.getAppState((err, appState) => {
                        if (err) {
                            console.error('❌ Error saving appstate:', err);
                        } else {
                            fs.writeJson(this.appStatePath, appState)
                                .then(() => console.log('✅ Appstate saved successfully'))
                                .catch(err => console.error('❌ Error writing appstate:', err));
                        }
                    });

                    resolve(api);
                });
            });
        } catch (error) {
            console.error('❌ Error in loginWithCredentials:', error);
            throw error;
        }
    }

    async sendMessage(threadID, message) {
        if (!this.api) {
            throw new Error('Facebook API not initialized');
        }

        try {
            // Add delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return new Promise((resolve, reject) => {
                this.api.sendMessage(message, threadID, (err, info) => {
                    if (err) {
                        console.error('❌ Error sending message:', err);
                        if (err.error === 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in too frequently, or checking in too frequently.') {
                            // Try to reinitialize the API
                            this.initialize()
                                .then(() => {
                                    // Retry sending the message
                                    this.sendMessage(threadID, message)
                                        .then(resolve)
                                        .catch(reject);
                                })
                                .catch(reject);
                        } else {
                            reject(err);
                        }
                        return;
                    }
                    resolve(info);
                });
            });
        } catch (error) {
            console.error('❌ Error in sendMessage:', error);
            throw error;
        }
    }

    listen(callback) {
        if (!this.api) {
            throw new Error('Facebook API not initialized');
        }

        this.api.setOptions({
            logLevel: 'silent',
            forceLogin: true,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        this.api.listen((err, message) => {
            if (err) {
                console.error('❌ Error in message listener:', err);
                if (err.error === 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in too frequently, or checking in too frequently.') {
                    // Try to reinitialize the API
                    this.initialize()
                        .then(() => {
                            console.log('✅ API reinitialized, restarting listener...');
                            this.listen(callback);
                        })
                        .catch(error => {
                            console.error('❌ Failed to reinitialize API:', error);
                        });
                }
                return;
            }

            try {
                callback(message);
            } catch (error) {
                console.error('❌ Error in message callback:', error);
            }
        });
    }

    async getUserInfo(userID) {
        if (!this.api) {
            throw new Error('Facebook API not initialized');
        }

        try {
            return new Promise((resolve, reject) => {
                this.api.getUserInfo(userID, (err, info) => {
                    if (err) {
                        console.error('❌ Error getting user info:', err);
                        // Return basic info if detailed info fails
                        resolve({
                            name: 'User',
                            firstName: 'User',
                            vanity: userID,
                            profileUrl: `https://facebook.com/${userID}`
                        });
                        return;
                    }
                    resolve(info[userID]);
                });
            });
        } catch (error) {
            console.error('❌ Error in getUserInfo:', error);
            // Return basic info on error
            return {
                name: 'User',
                firstName: 'User',
                vanity: userID,
                profileUrl: `https://facebook.com/${userID}`
            };
        }
    }

    isGroupChat(threadID) {
        return threadID.toString().length > 15;
    }
}

module.exports = { FacebookAPI }; 