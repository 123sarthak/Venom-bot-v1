const login = require("@dongdev/fca-unofficial");

const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const path = require('path');

class FacebookAPI {
    constructor() {
        this.api = null;
        this.appstatePath = path.join(__dirname, '../../appstate.json');
        this.isLoggedIn = false;
        this.loginAttempts = 0;
        this.maxLoginAttempts = 3;
        this.retryDelay = 5000; // 5 seconds
    }

    async initialize() {
        try {
            console.log('📱 Starting Facebook login process...');
            
            // Check if appstate exists
            if (!fs.existsSync(this.appstatePath)) {
                console.log('❌ No appstate.json found. Please provide your Facebook credentials.');
                return await this.loginWithCredentials();
            }

            console.log('📱 Found appstate.json, attempting to login...');
            const appstate = await fs.readJson(this.appstatePath);
            
            // Validate appstate
            if (!this.isValidAppstate(appstate)) {
                console.log('❌ Invalid appstate.json format. Please generate a new one.');
                return await this.loginWithCredentials();
            }

            return await this.loginWithAppstate(appstate);
        } catch (error) {
            console.error('❌ Login error:', error);
            return false;
        }
    }

    isValidAppstate(appstate) {
        try {
            // Basic validation of appstate structure
            return Array.isArray(appstate) && 
                   appstate.length > 0 && 
                   appstate.every(cookie => 
                       cookie && 
                       typeof cookie === 'object' && 
                       cookie.key && 
                       cookie.value && 
                       cookie.domain
                   );
        } catch (error) {
            console.error('❌ Error validating appstate:', error);
            return false;
        }
    }

    async loginWithAppstate(appstate) {
        return new Promise((resolve, reject) => {
            const loginOptions = {
                appState: appstate,
                forceLogin: true,
                logLevel: 'info'
            };

            console.log('🔄 Attempting to login with appstate...');
            
            login(loginOptions, async (err, api) => {
                if (err) {
                    console.error('❌ Appstate login failed:', err);
                    
                    // Handle specific error cases
                    if (err.error === 'login-approval') {
                        console.log('⚠️ Login approval required. Please check your Facebook account.');
                    } else if (err.error === 'checkpoint') {
                        console.log('⚠️ Account checkpoint detected. Please verify your account on Facebook.');
                    } else if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
                        console.log('⚠️ Connection error. Will retry...');
                        if (this.loginAttempts < this.maxLoginAttempts) {
                            this.loginAttempts++;
                            console.log(`🔄 Retry attempt ${this.loginAttempts}/${this.maxLoginAttempts}`);
                            setTimeout(() => {
                                this.loginWithAppstate(appstate).then(resolve).catch(reject);
                            }, this.retryDelay);
                            return;
                        }
                    }
                    
                    // If all retries failed, try credentials
                    console.log('⚠️ Falling back to credentials login...');
                    try {
                        const result = await this.loginWithCredentials();
                        resolve(result);
                    } catch (credError) {
                        reject(credError);
                    }
                    return;
                }

                this.api = api;
                this.isLoggedIn = true;
                console.log('✅ Successfully logged in to Facebook!');
                
                // Try to get user info, but don't fail if it errors
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

                // Save the new appstate if login was successful
                try {
                    const newAppstate = api.getAppState();
                    await fs.writeJson(this.appstatePath, newAppstate, { spaces: 2 });
                    console.log('✅ Updated appstate.json saved successfully!');
                } catch (saveError) {
                    console.error('❌ Error saving appstate:', saveError);
                }

                resolve(true);
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

            console.log('🔄 Attempting to login with credentials...');
            
            login({ email, password }, async (err, api) => {
                if (err) {
                    console.error('❌ Login failed:', err);
                    
                    if (err.error === 'login-approval') {
                        console.log('⚠️ Login approval required. Please check your Facebook account.');
                    } else if (err.error === 'checkpoint') {
                        console.log('⚠️ Account checkpoint detected. Please verify your account on Facebook.');
                    }
                    
                    reject(err);
                    return;
                }

                this.api = api;
                this.isLoggedIn = true;
                console.log('✅ Successfully logged in to Facebook!');

                // Save the new appstate
                try {
                    const appstate = api.getAppState();
                    await fs.writeJson(this.appstatePath, appstate, { spaces: 2 });
                    console.log('✅ New appstate.json saved successfully!');
                } catch (saveError) {
                    console.error('❌ Error saving appstate:', saveError);
                }

                resolve(true);
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
            
            // If we get a 404 or connection error, try to reinitialize
            if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.statusCode === 404) {
                console.log('⚠️ Connection error detected. Attempting to reinitialize...');
                const reinitialized = await this.initialize();
                if (reinitialized) {
                    // Retry sending the message
                    try {
                        await this.api.sendMessage(message, threadID);
                        console.log('✅ Message sent successfully after reinitialization');
                        return true;
                    } catch (retryError) {
                        console.error('❌ Error sending message after reinitialization:', retryError);
                    }
                }
            }
            
            return false;
        }
    }

    listen(callback) {
        if (!this.api || !this.isLoggedIn) {
            console.error('❌ API not initialized or not logged in');
            return;
        }

        console.log('👂 Listening for messages...');
        
        const listenCallback = async (err, message) => {
            if (err) {
                console.error('❌ Listen error:', err);
                
                // If we get a 404 or connection error, try to reinitialize
                if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.statusCode === 404) {
                    console.log('⚠️ Connection error detected. Attempting to reinitialize...');
                    const reinitialized = await this.initialize();
                    if (reinitialized) {
                        // Restart listening
                        console.log('🔄 Restarting message listener...');
                        this.api.listen(listenCallback);
                    }
                }
                return;
            }

            if (message && message.body) {
                console.log(`📥 Received message in thread ${message.threadID}: ${message.body}`);
                callback(message);
            }
        };

        this.api.listen(listenCallback);
    }

    isGroupChat(threadID) {
        return threadID.toString().length > 15;
    }
}

module.exports = { FacebookAPI }; 