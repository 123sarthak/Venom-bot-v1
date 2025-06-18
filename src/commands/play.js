const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const YTDLP_PATH = 'C:/Users/sarth/AppData/Roaming/Python/Python313/Scripts/yt-dlp.exe';
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
            return '❌ Failed to search YouTube. Please try again later.';
        }

        if (!video) {
            return `❌ No results found for: *${query}*`;
        }

        await fb.sendMessage(threadID, `🎵 Found: *${video.title}*\n⏳ Downloading and converting to MP3...`);

        // 2. Download audio using ytdl-core, fallback to yt-dlp if needed
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

            // Try ytdl-core first
            await new Promise((resolve, reject) => {
                const audioStream = ytdl(video.url, {
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });

                ffmpeg(audioStream)
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
            });
        } catch (err) {
            // If ytdl-core fails, fallback to yt-dlp
            console.error('ytdl-core failed, trying yt-dlp fallback:', err.message);
            await fb.sendMessage(threadID, '⚠️ ytdl-core failed, trying yt-dlp fallback...');
            try {
                await new Promise((resolve, reject) => {
                    const ytDlpProcess = spawn(
                        YTDLP_PATH,
                        [
                            video.url,
                            '-f', 'bestaudio',
                            '--extract-audio',
                            '--audio-format', 'mp3',
                            '--audio-quality', '0',
                            '-o', filePath
                        ]
                    );

                    ytDlpProcess.stdout.on('data', (data) => {
                        console.log(`[yt-dlp] ${data}`.trim());
                    });
                    ytDlpProcess.stderr.on('data', (data) => {
                        console.error(`[yt-dlp] ${data}`.trim());
                    });
                    ytDlpProcess.on('close', (code) => {
                        if (code === 0 && fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
                            resolve();
                        } else {
                            reject(new Error('yt-dlp failed to download audio.'));
                        }
                    });
                });
            } catch (ytDlpErr) {
                console.error('yt-dlp fallback failed:', ytDlpErr);
                return `❌ Failed to download or convert audio with both ytdl-core and yt-dlp.\n\n**Error:** ${ytDlpErr.message}`;
            }
        }

        // 3. Check if file was created successfully
        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
            return '❌ Downloaded file is empty or was not created.';
        }

        // 4. Check file size
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_MESSENGER_FILE_SIZE) {
            return `✅ Song downloaded, but it is too large to send on Messenger (limit: 25MB).\n\n**File:** ${fileName}\n**Size:** ${(stats.size / (1024*1024)).toFixed(2)} MB`;
        }

        // 5. Send audio as attachment
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
    }
}

module.exports = PlayCommand; 