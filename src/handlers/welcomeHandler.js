class WelcomeHandler {
    constructor() {
        this.welcomeMessages = [
            "🎉 **Welcome to the group!** 🎉\n\n👋 Hey there! We're excited to have you join us!\n\n💡 **Quick Tips:**\n• Use !help to see all commands\n• Use !tictactoe to play a game\n• Be respectful to everyone\n\n🎮 **Have fun and enjoy your stay!** 🎮",
            
            "🌟 **Welcome aboard!** 🌟\n\n👋 Hello and welcome to our amazing community!\n\n🎯 **Getting Started:**\n• Type !help for command list\n• Try !tictactoe for some fun\n• Make friends and have fun!\n\n🚀 **Let's make this group awesome together!** 🚀",
            
            "🎊 **Welcome to the family!** 🎊\n\n👋 Hi there! We're so happy you're here!\n\n💫 **What you can do:**\n• Use !help to explore commands\n• Play !tictactoe with friends\n• Share and connect with others\n\n✨ **Welcome to the best group ever!** ✨",
            
            "🎈 **Welcome!** 🎈\n\n👋 Hey! Great to see you here!\n\n🎮 **Ready to have fun?**\n• Check out !help for all features\n• Challenge someone to !tictactoe\n• Enjoy the community vibes!\n\n🎪 **Let the fun begin!** 🎪",
            
            "🎁 **Welcome to the party!** 🎁\n\n👋 Hello there! You're officially part of the crew!\n\n🎯 **Quick start guide:**\n• !help - See all commands\n• !tictactoe - Play a game\n• !about - Learn about the bot\n\n🎉 **Welcome to the best group!** 🎉"
        ];
        
        this.goodbyeMessages = [
            "👋 **Goodbye!** 👋\n\n😢 We'll miss you!\n\n💭 **Take care and come back soon!**\n\n🌟 **Thanks for being part of our community!** 🌟",
            
            "🚪 **See you later!** 🚪\n\n😔 Sad to see you go!\n\n💫 **Hope to see you again soon!**\n\n🎈 **Thanks for the memories!** 🎈",
            
            "👋 **Farewell!** 👋\n\n😢 You'll be missed!\n\n💝 **Take care and stay awesome!**\n\n🎊 **Thanks for being amazing!** 🎊",
            
            "🚶‍♂️ **Goodbye friend!** 🚶‍♀️\n\n😔 We're sad to see you leave!\n\n💫 **Hope your journey is amazing!**\n\n🌟 **Thanks for being part of us!** 🌟",
            
            "👋 **Until next time!** 👋\n\n😢 We'll keep a spot for you!\n\n💭 **Come back whenever you want!**\n\n🎁 **Thanks for the good times!** 🎁"
        ];
    }

    getWelcomeMessage() {
        const randomIndex = Math.floor(Math.random() * this.welcomeMessages.length);
        return this.welcomeMessages[randomIndex];
    }

    getGoodbyeMessage() {
        const randomIndex = Math.floor(Math.random() * this.goodbyeMessages.length);
        return this.goodbyeMessages[randomIndex];
    }

    async handleWelcome(threadID, userID, userName, fb) {
        try {
            const welcomeMsg = this.getWelcomeMessage();
            await fb.sendMessage(welcomeMsg, threadID);
            console.log(`👋 Welcome message sent for ${userName} (${userID}) in thread ${threadID}`);
        } catch (error) {
            console.error('❌ Error sending welcome message:', error);
        }
    }

    async handleGoodbye(threadID, userID, userName, fb) {
        try {
            const goodbyeMsg = this.getGoodbyeMessage();
            await fb.sendMessage(goodbyeMsg, threadID);
            console.log(`👋 Goodbye message sent for ${userName} (${userID}) in thread ${threadID}`);
        } catch (error) {
            console.error('❌ Error sending goodbye message:', error);
        }
    }
}

module.exports = WelcomeHandler; 