const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
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
            return '❌ Failed to search YouTube.';
        }

        if (!video) {
            return `❌ No results found for: *${query}*`;
        }

        // 2. Download audio and convert to MP3
        const fileName = `song_${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '../../downloads', fileName);
        try {
            await new Promise((resolve, reject) => {
                ffmpeg(ytdl(video.url, { filter: 'audioonly' }))
                    .setFfmpegPath(ffmpegPath)
                    .audioBitrate(128)
                    .format('mp3')
                    .save(filePath)
                    .on('end', resolve)
                    .on('error', reject);
            });
        } catch (err) {
            return '❌ Failed to download or convert audio.';
        }

        // 3. Check file size
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_MESSENGER_FILE_SIZE) {
            return `✅ Song downloaded, but it is too large to send on Messenger (limit: 25MB).\n\n**File:** ${fileName}\n**Size:** ${(stats.size / (1024*1024)).toFixed(2)} MB`;
        }

        // 4. Send audio as attachment
        try {
            await fb.sendMessage(threadID, {
                body: `🎵 *${video.title}*\nBy: ${video.author.name}\nDuration: ${video.timestamp}`,
                attachment: fs.createReadStream(filePath)
            });
            return null;
        } catch (err) {
            return `✅ Song downloaded, but failed to send as attachment.\n\n**File:** ${fileName}`;
        }
    }
}

module.exports = PlayCommand; 