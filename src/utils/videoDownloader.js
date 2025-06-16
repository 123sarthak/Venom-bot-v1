const ytdl = require('ytdl-core');
const axios = require('axios');

class VideoDownloader {
    constructor() {
        this.supportedPlatforms = ['youtube', 'facebook', 'instagram'];
    }

    async downloadVideo(url) {
        try {
            // Check if it's a YouTube URL
            if (ytdl.validateURL(url)) {
                return await this.handleYouTubeDownload(url);
            }
            
            // Check if it's a Facebook URL
            if (url.includes('facebook.com') || url.includes('fb.watch')) {
                return await this.handleFacebookDownload(url);
            }

            // Check if it's an Instagram URL
            if (url.includes('instagram.com')) {
                return await this.handleInstagramDownload(url);
            }

            return "Sorry, this URL is not supported. Currently supporting: YouTube, Facebook, and Instagram videos.";
        } catch (error) {
            console.error('Download error:', error);
            return "Sorry, there was an error downloading the video. Please check the URL and try again.";
        }
    }

    async handleYouTubeDownload(url) {
        try {
            const info = await ytdl.getInfo(url);
            const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
            
            return `🎥 *Video Information*\n\n` +
                   `Title: ${info.videoDetails.title}\n` +
                   `Duration: ${info.videoDetails.lengthSeconds} seconds\n` +
                   `Quality: ${format.qualityLabel}\n\n` +
                   `Download URL: ${format.url}\n\n` +
                   `Note: The download URL is temporary and will expire soon.`;
        } catch (error) {
            console.error('YouTube download error:', error);
            return "Sorry, there was an error processing the YouTube video.";
        }
    }

    async handleFacebookDownload(url) {
        // Note: Facebook video downloading requires additional authentication
        // This is a placeholder for the actual implementation
        return "Facebook video download is currently under maintenance. Please try again later.";
    }

    async handleInstagramDownload(url) {
        // Note: Instagram video downloading requires additional authentication
        // This is a placeholder for the actual implementation
        return "Instagram video download is currently under maintenance. Please try again later.";
    }
}

module.exports = { VideoDownloader }; 