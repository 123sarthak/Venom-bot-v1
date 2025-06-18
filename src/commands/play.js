const ytSearch = require('yt-search');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const MAX_MESSENGER_FILE_SIZE = 25 * 1024 * 1024;

const downloadAudioFromYouTube = (url, outputFilename, onSuccess, onError) => {
  const outputPath = path.resolve(__dirname, '../downloads', outputFilename + '.mp3');
  const cookiesPath = path.resolve(__dirname, '../../cookies.txt');

  // Build yt-dlp args
  const args = [
    '-m', 'yt_dlp',
    '--extract-audio',
    '--audio-format', 'mp3',
    '--ffmpeg-location', 'ffmpeg',
    '-o', outputPath
  ];
  if (fs.existsSync(cookiesPath)) {
    console.log('[yt-dlp] Using cookies.txt for YouTube authentication');
    args.push('--cookies', cookiesPath);
  } else {
    console.warn('[yt-dlp] WARNING: cookies.txt not found. Some YouTube downloads may fail due to CAPTCHA or login requirements.');
  }
  args.push(url);

  const ytdlp = spawn('python', args);

  ytdlp.stdout.on('data', (data) => {
    console.log(`[yt-dlp] ${data}`);
  });

  ytdlp.stderr.on('data', (data) => {
    console.error(`[yt-dlp ERROR] ${data}`);
  });

  ytdlp.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Download complete:', outputPath);
      onSuccess(outputPath);
    } else {
      console.error('❌ yt-dlp failed with exit code', code);
      onError(new Error('yt-dlp failed to download audio.'));
    }
  });
};

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

        // 2. Download audio using yt-dlp
        const fileName = `song_${Date.now()}`;
        
        try {
            // Ensure downloads directory exists
            const downloadsDir = path.join(__dirname, '../../downloads');
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            // Download using the improved yt-dlp function
            await new Promise((resolve, reject) => {
                downloadAudioFromYouTube(
                    video.url,
                    fileName,
                    (outputPath) => {
                        console.log('✅ yt-dlp download completed successfully');
                        resolve(outputPath);
                    },
                    (error) => {
                        console.error('yt-dlp download failed:', error);
                        reject(error);
                    }
                );
            });

        } catch (err) {
            console.error('yt-dlp download failed:', err);
            return `❌ Failed to download audio with yt-dlp.\n\n**Error:** ${err.message}`;
        }

        // 3. Check if file was created successfully
        const filePath = path.join(__dirname, '../../downloads', fileName + '.mp3');
        if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
            return '❌ Downloaded file is empty or was not created.';
        }

        // 4. Check file size
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_MESSENGER_FILE_SIZE) {
            return `✅ Song downloaded, but it is too large to send on Messenger (limit: 25MB).\n\n**File:** ${fileName}.mp3\n**Size:** ${(stats.size / (1024*1024)).toFixed(2)} MB`;
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
                        console.log(`Cleaned up: ${fileName}.mp3`);
                    }
                } catch (cleanupErr) {
                    console.error('Cleanup error:', cleanupErr);
                }
            }, 5000);
            
            return null;
        } catch (err) {
            console.error('Send attachment error:', err);
            return `✅ Song downloaded, but failed to send as attachment.\n\n**File:** ${fileName}.mp3\n**Error:** ${err.message}`;
        }
    }
}

module.exports = PlayCommand; 