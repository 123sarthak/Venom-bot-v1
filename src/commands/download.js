const VideoDownloader = require('../utils/videoDownloader');
const fs = require('fs');

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

        try {
            // Start the download
            const result = await this.videoDownloader.downloadVideo(url, platform);
            if (result.success) {
                // Try to send the video as an attachment
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
• Try a different YouTube video`;
                    break;
                case 'facebook':
                    errorMessage += `

**🔧 Facebook Troubleshooting:**
• Make sure the video is public
• Check if the video is still available
• Try a different Facebook video`;
                    break;
                case 'instagram':
                    errorMessage += `

**🔧 Instagram Troubleshooting:**
• Make sure the post is public
• Check if the post is still available
• Try a different Instagram post`;
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