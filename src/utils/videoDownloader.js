const ytdl = require('ytdl-core');
const axios = require('axios');
const { formatText } = require('./textFormatter');

class VideoDownloader {
    constructor() {
        this.supportedPlatforms = {
            youtube: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
            facebook: /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.watch)\/(?:.*?\/videos\/|.*?\/watch\?v=|.*?\/watch\?.*?v=)(\d+)/i,
            instagram: /(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:p|reel)\/([^\/?#&]+)/i
        };
    }

    async downloadVideo(url) {
        try {
            // Detect platform
            const platform = this.detectPlatform(url);
            if (!platform) {
                return formatText('❌ Unsupported video platform. Currently supports: YouTube, Facebook, and Instagram.');
            }

            // Show processing message
            const processingMsg = formatText('⏳ Processing video... Please wait.');

            // Download based on platform
            switch (platform) {
                case 'youtube':
                    return await this.downloadYouTube(url);
                case 'facebook':
                    return await this.downloadFacebook(url);
                case 'instagram':
                    return await this.downloadInstagram(url);
                default:
                    return formatText('❌ Unsupported video platform.');
            }
        } catch (error) {
            console.error('Video download error:', error);
            return formatText('❌ Error downloading video. Please check the URL and try again.');
        }
    }

    detectPlatform(url) {
        for (const [platform, regex] of Object.entries(this.supportedPlatforms)) {
            if (regex.test(url)) {
                return platform;
            }
        }
        return null;
    }

    async downloadYouTube(url) {
        try {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
            
            if (!format) {
                return formatText('❌ Could not find suitable video format.');
            }

            const videoInfo = {
                title: info.videoDetails.title,
                duration: this.formatDuration(info.videoDetails.lengthSeconds),
                url: format.url,
                thumbnail: info.videoDetails.thumbnails[0].url
            };

            return formatText(`🎥 *YouTube Video*\n\n` +
                `📝 *Title:* ${videoInfo.title}\n` +
                `⏱️ *Duration:* ${videoInfo.duration}\n\n` +
                `🔗 *Video URL:* ${videoInfo.url}\n` +
                `🖼️ *Thumbnail:* ${videoInfo.thumbnail}\n\n` +
                `💡 *Tip:* Click the video URL to watch directly!`);
        } catch (error) {
            console.error('YouTube download error:', error);
            return formatText('❌ Error downloading YouTube video. Please check the URL and try again.');
        }
    }

    async downloadFacebook(url) {
        try {
            // Extract video ID
            const match = url.match(this.supportedPlatforms.facebook);
            if (!match) {
                return formatText('❌ Invalid Facebook video URL.');
            }

            const videoId = match[1];
            // Note: Facebook video downloading requires additional setup
            // This is a placeholder for the actual implementation
            return formatText(`🎥 *Facebook Video*\n\n` +
                `⚠️ Facebook video downloading is currently being implemented.\n` +
                `Video ID: ${videoId}\n\n` +
                `Please check back later for this feature!`);
        } catch (error) {
            console.error('Facebook download error:', error);
            return formatText('❌ Error processing Facebook video. Please try again later.');
        }
    }

    async downloadInstagram(url) {
        try {
            // Extract post ID
            const match = url.match(this.supportedPlatforms.instagram);
            if (!match) {
                return formatText('❌ Invalid Instagram video URL.');
            }

            const postId = match[1];
            // Note: Instagram video downloading requires additional setup
            // This is a placeholder for the actual implementation
            return formatText(`🎥 *Instagram Video*\n\n` +
                `⚠️ Instagram video downloading is currently being implemented.\n` +
                `Post ID: ${postId}\n\n` +
                `Please check back later for this feature!`);
        } catch (error) {
            console.error('Instagram download error:', error);
            return formatText('❌ Error processing Instagram video. Please try again later.');
        }
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

module.exports = { VideoDownloader }; 
module.exports = { VideoDownloader }; 