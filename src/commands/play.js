const ytSearch = require('yt-search');
const play = require('play-dl');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// --- YouTube cookies support ---
try {
    const cookiesPath = path.join(__dirname, '../../youtube_cookies.txt');
    if (fs.existsSync(cookiesPath)) {
        const fileContent = fs.readFileSync(cookiesPath, 'utf8');
        
        // Extract the cookie line (skip comments and code lines)
        const lines = fileContent.split('\n');
        let cookies = '';
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            // Look for a line that contains cookie values (has SID= and multiple cookies)
            if (trimmedLine && trimmedLine.includes('SID=') && trimmedLine.includes(';')) {
                cookies = trimmedLine;
                break;
            }
        }
        
        if (cookies) {
            play.setToken({
                youtube: { 
                    cookie: cookies,
                    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            console.log('✅ YouTube cookies and user agent loaded for play-dl');
        } else {
            console.log('ℹ️ No valid cookies found in youtube_cookies.txt, using default configuration');
        }
    } else {
        console.log('ℹ️ youtube_cookies.txt not found, using default configuration');
    }
} catch (err) {
    console.error('Error loading YouTube cookies:', err);
    console.log('⚠️ Continuing with default configuration');
}

// --- YouTube configuration removed to avoid cookie parsing errors ---
// play-dl will use its default configuration without any token setting
console.log('ℹ️ Using play-dl with default configuration (no custom tokens)');

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

        // 1. Search YouTube with better error handling
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

        // 2. Download audio with multiple fallback methods
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

            // Try multiple download methods
            let downloadSuccess = false;
            let lastError = null;

            // Method 1: Try play-dl with different quality options
            const qualityOptions = [140, 251, 250, 249]; // Different audio qualities
            
            for (const quality of qualityOptions) {
                try {
                    console.log(`Trying play-dl with quality ${quality}...`);
                    
                    await new Promise((resolve, reject) => {
                        play.stream(video.url, { quality: quality })
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
                                console.error(`Play-dl error with quality ${quality}:`, err);
                                reject(err);
                            });
                    });

                    // Check if file was created successfully
                    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
                        downloadSuccess = true;
                        console.log(`Successfully downloaded with quality ${quality}`);
                        break;
                    }
                } catch (err) {
                    lastError = err;
                    console.error(`Failed with quality ${quality}:`, err.message);
                    continue;
                }
            }

            if (!downloadSuccess) {
                // If all play-dl methods fail, suggest using download command
                if (lastError && (lastError.message.includes('sign in to confirm') || lastError.message.includes('bot') || lastError.message.includes('unusual traffic'))) {
                    return `❌ YouTube is blocking automated requests for this song.\n\n🎯 **Solution:** Use the download command instead:\n\n\`!download ${video.url}\`\n\nThis will download the video directly, which often works better for songs that trigger bot detection.`;
                }
                throw new Error(`All download methods failed. Last error: ${lastError?.message || 'Unknown error'}`);
            }

            // 3. Check file size and send
            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                throw new Error('Downloaded file is empty');
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
            
            // Provide helpful error messages
            let errorMessage = `❌ Failed to download or convert audio.\n\n**Error:** ${err.message}`;
            
            if (err.message.includes('sign in to confirm') || err.message.includes('bot') || err.message.includes('unusual traffic')) {
                errorMessage += '\n\n🔧 **YouTube Bot Detection Issue:**\n';
                errorMessage += '• YouTube is blocking automated requests\n';
                errorMessage += '• Try using `!download <youtube_url>` instead\n';
                errorMessage += '• Wait a few minutes before trying again\n';
                errorMessage += '• Try a different song\n';
                errorMessage += '• The bot will automatically retry with different methods\n\n';
                errorMessage += '💡 **Alternative:** Use direct YouTube URL:\n';
                errorMessage += '`!download https://www.youtube.com/watch?v=VIDEO_ID`';
            } else if (err.message.includes('network') || err.message.includes('connection')) {
                errorMessage += '\n\n🌐 **Solution:** Check your internet connection and try again.';
            } else {
                errorMessage += '\n\n💡 **Try:**\n• Check your internet connection\n• Try a different song\n• Make sure the song is available on YouTube\n• Use `!download <youtube_url>` for direct downloads';
            }
            
            return errorMessage;
        }
    }
}

module.exports = PlayCommand; 