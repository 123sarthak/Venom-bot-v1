const ytSearch = require('yt-search');
const play = require('play-dl');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const MAX_MESSENGER_FILE_SIZE = 25 * 1024 * 1024;

class PlayCommand {
    constructor() {
        this.name = 'play';
        this.description = 'Play a song by name (searches YouTube and sends audio)';
    }

    async execute(args, context) {
        const { threadID } = context;
        const fb = context.fb || global.fb;

        if (!args.length) {
            return '❌ **Usage:** !play <song name>\n\nExample: !play shape of you';
        }

        const query = args.join(' ');
        await fb.sendMessage(threadID, `🔎 Searching YouTube for: *${query}* ...`);

        // 1. Search YouTube
        let video;
        try {
            const result = await ytSearch(query);
            video = result.videos && result.videos.length > 0 ? result.videos[0] : null;
        } catch (err) {
            console.error('YouTube search error:', err);
            return '❌ Failed to search YouTube.';
        }

        if (!video) {
            return `❌ No results found for: *${query}*`;
        }

        await fb.sendMessage(threadID, `🎵 Found: *${video.title}*\n⏳ Downloading and converting to MP3...`);

        // 2. Download audio and convert to MP3
        const fileName = `song_${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '../../downloads', fileName);
        
        try {
            // Ensure downloads directory exists
            const downloadsDir = path.dirname(filePath);
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            // Set ffmpeg path
            ffmpeg.setFfmpegPath(ffmpegPath);

            // Download and convert using play-dl
            await new Promise((resolve, reject) => {
                play.stream(video.url, { quality: 140 }) // 140 = audio only
                    .then(stream => {
                        ffmpeg(stream.stream)
                            .audioBitrate(128)
                            .audioChannels(2)
                            .audioFrequency(44100)
                            .format('mp3')
                            .on('start', (commandLine) => {
                                console.log('FFmpeg started:', commandLine);
                            })
                            .on('progress', (progress) => {
                                console.log('FFmpeg progress:', progress.percent + '%');
                            })
                            .on('error', (err) => {
                                console.error('FFmpeg error:', err);
                                reject(err);
                            })
                            .on('end', () => {
                                console.log('FFmpeg conversion completed');
                                resolve();
                            })
                            .save(filePath);
                    })
                    .catch(err => {
                        console.error('Play-dl error:', err);
                        reject(err);
                    });
            });

            // 3. Check if file was created and get its size
            if (!fs.existsSync(filePath)) {
                throw new Error('File was not created');
            }

            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                throw new Error('File is empty');
            }

            if (stats.size > MAX_MESSENGER_FILE_SIZE) {
                return `✅ Song downloaded, but it is too large to send on Messenger (limit: 25MB).\n\n**File:** ${fileName}\n**Size:** ${(stats.size / (1024*1024)).toFixed(2)} MB`;
            }

            // 4. Send audio as attachment
            try {
                await fb.sendMessage(threadID, {
                    body: `🎵 *${video.title}*\n👤 By: ${video.author.name}\n⏱️ Duration: ${video.timestamp}\n📁 Size: ${(stats.size / (1024*1024)).toFixed(2)} MB`,
                    attachment: fs.createReadStream(filePath)
                });
                
                // Clean up the file after sending
                setTimeout(() => {
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                            console.log(`Cleaned up: ${fileName}`);
                        }
                    } catch (cleanupErr) {
                        console.error('Cleanup error:', cleanupErr);
                    }
                }, 5000);
                
                return null;
            } catch (err) {
                console.error('Send attachment error:', err);
                return `✅ Song downloaded, but failed to send as attachment.\n\n**File:** ${fileName}\n**Error:** ${err.message}`;
            }

        } catch (err) {
            console.error('Download/convert error:', err);
            return `❌ Failed to download or convert audio.\n\n**Error:** ${err.message}\n\n**Try:**\n• Check your internet connection\n• Try a different song\n• Make sure the song is available on YouTube`;
        }
    }
}

module.exports = PlayCommand; 