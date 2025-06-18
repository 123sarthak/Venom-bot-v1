const VideoDownloader = require('../utils/videoDownloader');
const fs = require('fs');
const path = require('path');

// Messenger's max file size for attachments (approx 25MB)
const MAX_MESSENGER_FILE_SIZE = 25 * 1024 * 1024;

class DownloadCommand {
    constructor() {
        this.name = 'download';
        this.description = 'Download video from URL (YouTube, Facebook, Instagram)';
        this.videoDownloader = new VideoDownloader();
    }

    async execute(args, context) {
        const { threadID } = context;
        const fb = context.fb || global.fb; // fallback for backward compatibility

        if (args.length === 0) {
            return `❌ **Usage:** !download <url>
            
**💡 Examples:**
• !download https://www.youtube.com/watch?v=dQw4w9WgXcQ
• !download https://www.facebook.com/watch?v=123456789
• !download https://www.instagram.com/p/ABC123/

**📱 Supported Platforms:**
• 🎥 YouTube Videos
• 📘 Facebook Videos
• 📷 Instagram Videos & Reels

**⚠️ Note:** Videos are downloaded to the bot's server and will be automatically cleaned up after 24 hours.`;
        }

        const url = args[0];
        
        // Validate URL
        if (!this.isValidUrl(url)) {
            return `❌ **Invalid URL!** Please provide a valid video URL.
            
**💡 Examples:**
• YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
• Facebook: https://www.facebook.com/watch?v=123456789
• Instagram: https://www.instagram.com/p/ABC123/`;
        }

        // Detect platform
        const platform = this.videoDownloader.detectPlatform(url);
        if (!platform) {
            return `❌ **Unsupported Platform!** Currently supported platforms:
            
**✅ Supported:**
• 🎥 YouTube Videos
• 📘 Facebook Videos  
• 📷 Instagram Videos & Reels

**❌ Not Supported:**
• TikTok
• Twitter
• Other platforms`;
        }

        // 1. Notify user that download is starting
        await fb.sendMessage(threadID, `⏳ Downloading your video from ${platform.charAt(0).toUpperCase() + platform.slice(1)}... Please wait!`);

        try {
            // 2. Start the download
            const result = await this.videoDownloader.downloadVideo(url, platform);
            if (result.success) {
                // 3. Check file size
                const stats = fs.statSync(result.filePath);
                if (stats.size > MAX_MESSENGER_FILE_SIZE) {
                    // File too large for Messenger
                    return `✅ Video downloaded, but it's too large to send on Messenger (limit: 25MB).

**File:** ${result.fileName}
**Size:** ${(stats.size / (1024*1024)).toFixed(2)} MB

If you want to serve files via HTTP, let the developer know!`;
                }
                // 4. Try to send the video as an attachment
                try {
                    await fb.sendMessage(threadID, {
                        body: `✅ Here is your downloaded video from ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`,
                        attachment: fs.createReadStream(result.filePath)
                    });
                    return null; // Already sent as attachment
                } catch (err) {
                    return `✅ Video downloaded, but failed to send as attachment (maybe too large for Messenger).\n\n**File:** ${result.fileName}\n**Path:** ${result.filePath}\n\nTry downloading a smaller/shorter video.`;
                }
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Download error:', error);
            
            let errorMessage = `❌ **Download Failed!**
            
**🔗 URL:** ${url}
**📱 Platform:** ${platform ? (platform.charAt(0).toUpperCase() + platform.slice(1)) : 'Unknown'}
**❌ Error:** ${error.message}`;

            // Add platform-specific troubleshooting tips
            switch (platform) {
                case 'youtube':
                    errorMessage += `

**🔧 YouTube Troubleshooting:**
• Make sure the video is public and not age-restricted
• Check if the video is available in your region
• Try a different YouTube video
• Some videos may be copyright-protected`;
                    break;
                case 'facebook':
                    errorMessage += `

**🔧 Facebook Troubleshooting:**
• Make sure the video is public
• Check if the video is still available
• Try a different Facebook video
• Some videos may be private or deleted`;
                    break;
                case 'instagram':
                    errorMessage += `

**🔧 Instagram Troubleshooting:**
• Make sure the post is public
• Check if the post is still available
• Try a different Instagram post
• Some posts may be private or deleted
• Instagram may temporarily block downloads for some content`;
                    break;
            }

            errorMessage += `

**💡 Try again later or contact admin if the problem persists.**`;

            return errorMessage;
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

module.exports = DownloadCommand; 