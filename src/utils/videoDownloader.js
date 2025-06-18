const ytdl = require('ytdl-core');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const ig = require('instagram-url-direct');

class VideoDownloader {
    constructor() {
        this.downloadsDir = path.join(__dirname, '../../downloads');
        this.ensureDownloadsDir();
    }

    ensureDownloadsDir() {
        if (!fs.existsSync(this.downloadsDir)) {
            fs.mkdirSync(this.downloadsDir, { recursive: true });
        }
    }

    async downloadVideo(url, platform) {
        try {
            const fileName = `video_${Date.now()}.mp4`;
            const filePath = path.join(this.downloadsDir, fileName);

            switch (platform) {
                case 'youtube':
                    return await this.downloadYouTube(url, filePath, fileName);
                case 'facebook':
                    return await this.downloadFacebook(url, filePath, fileName);
                case 'instagram':
                    return await this.downloadInstagram(url, filePath, fileName);
                default:
                    throw new Error('Unsupported platform');
            }
        } catch (error) {
            console.error(`Error downloading video from ${platform}:`, error);
            throw error;
        }
    }

    async downloadYouTube(url, filePath, fileName) {
        try {
            // Use ytdl-core to get video stream
            const videoStream = ytdl(url, {
                quality: 'highest',
                filter: 'audioandvideo'
            });
            
            const writeStream = fs.createWriteStream(filePath);
            
            return new Promise((resolve, reject) => {
                videoStream.pipe(writeStream);

                writeStream.on('finish', () => {
                    resolve({
                        success: true,
                        filePath: filePath,
                        fileName: fileName,
                        platform: 'YouTube',
                        message: `✅ **YouTube video downloaded successfully!**\n\n📁 **File:** ${fileName}\n📱 **Platform:** YouTube\n💾 **Size:** ${this.getFileSize(filePath)}`
                    });
                });

                writeStream.on('error', (error) => {
                    reject(new Error(`Failed to write YouTube video: ${error.message}`));
                });

                videoStream.on('error', (error) => {
                    reject(new Error(`Failed to download YouTube video: ${error.message}`));
                });
            });
        } catch (error) {
            throw new Error(`YouTube download failed: ${error.message}`);
        }
    }

    async downloadFacebook(url, filePath, fileName) {
        try {
            // Extract video ID from Facebook URL
            const videoId = this.extractFacebookVideoId(url);
            if (!videoId) {
                throw new Error('Could not extract video ID from Facebook URL');
            }

            // Facebook video download API (this is a simplified approach)
            const response = await axios.get(`https://www.facebook.com/video/embed?video_id=${videoId}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // Extract video URL from response (this is a simplified approach)
            const videoUrlMatch = response.data.match(/hd_src:"([^"]+)"/);
            if (!videoUrlMatch) {
                throw new Error('Could not extract video URL from Facebook');
            }

            const videoUrl = videoUrlMatch[1];
            
            // Download the video
            const videoResponse = await axios({
                method: 'GET',
                url: videoUrl,
                responseType: 'stream'
            });

            const writeStream = fs.createWriteStream(filePath);
            videoResponse.data.pipe(writeStream);

            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    resolve({
                        success: true,
                        filePath: filePath,
                        fileName: fileName,
                        platform: 'Facebook',
                        message: `✅ **Facebook video downloaded successfully!**\n\n📁 **File:** ${fileName}\n📱 **Platform:** Facebook\n💾 **Size:** ${this.getFileSize(filePath)}`
                    });
                });

                writeStream.on('error', (error) => {
                    reject(new Error(`Failed to write Facebook video: ${error.message}`));
                });
            });
        } catch (error) {
            throw new Error(`Facebook download failed: ${error.message}`);
        }
    }

    async downloadInstagram(url, filePath, fileName) {
        try {
            // Use instagram-url-direct to get direct download links
            const result = await ig.getInfo(url);
            
            if (!result || !result.url_list || result.url_list.length === 0) {
                throw new Error('No video URL found');
            }

            // Get the best quality video URL (usually the first one)
            const videoUrl = result.url_list[0];
            
            // Download the video
            const videoResponse = await axios({
                method: 'GET',
                url: videoUrl,
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const writeStream = fs.createWriteStream(filePath);
            videoResponse.data.pipe(writeStream);

            return new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    resolve({
                        success: true,
                        filePath: filePath,
                        fileName: fileName,
                        platform: 'Instagram',
                        message: `✅ **Instagram video downloaded successfully!**\n\n📁 **File:** ${fileName}\n📱 **Platform:** Instagram\n💾 **Size:** ${this.getFileSize(filePath)}`
                    });
                });

                writeStream.on('error', (error) => {
                    reject(new Error(`Failed to write Instagram video: ${error.message}`));
                });
            });
        } catch (error) {
            throw new Error(`Instagram download failed: ${error.message}`);
        }
    }

    extractFacebookVideoId(url) {
        // Extract video ID from various Facebook URL formats
        const patterns = [
            /facebook\.com\/watch\?v=(\d+)/,
            /facebook\.com\/.*?\/videos\/(\d+)/,
            /fb\.watch\/([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    getFileSize(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const bytes = stats.size;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Bytes';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        } catch (error) {
            return 'Unknown size';
        }
    }

    detectPlatform(url) {
        // YouTube URL patterns
        const youtubePatterns = [
            /youtube\.com\/watch\?v=/,
            /youtu\.be\//,
            /youtube\.com\/embed\//,
            /youtube\.com\/v\//
        ];
        
        for (const pattern of youtubePatterns) {
            if (pattern.test(url)) {
                return 'youtube';
            }
        }
        
        if (url.includes('facebook.com') || url.includes('fb.watch')) {
            return 'facebook';
        } else if (url.includes('instagram.com')) {
            return 'instagram';
        }
        return null;
    }

    async cleanupOldFiles() {
        try {
            const files = await fs.readdir(this.downloadsDir);
            const now = Date.now();
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours

            for (const file of files) {
                const filePath = path.join(this.downloadsDir, file);
                const stats = await fs.stat(filePath);
                
                if (now - stats.mtime.getTime() > maxAge) {
                    await fs.remove(filePath);
                    console.log(`🗑️ Cleaned up old file: ${file}`);
                }
            }
        } catch (error) {
            console.error('Error cleaning up old files:', error);
        }
    }
}

module.exports = VideoDownloader; 