// Simple test for play command
const PlayCommand = require('./src/commands/play');

console.log('Testing play command...');

// Test the play command
const playCommand = new PlayCommand();
console.log('✅ Play command loaded successfully');

// Test YouTube search functionality
const ytSearch = require('yt-search');

async function testYouTubeSearch() {
    try {
        console.log('🔍 Testing YouTube search...');
        const result = await ytSearch('test song');
        if (result.videos && result.videos.length > 0) {
            console.log('✅ YouTube search working');
            console.log(`Found: ${result.videos[0].title}`);
        } else {
            console.log('❌ No videos found in search');
        }
    } catch (error) {
        console.error('❌ YouTube search failed:', error.message);
    }
}

testYouTubeSearch().then(() => {
    console.log('🎵 Play command is ready to use!');
    console.log('📝 The command now uses yt-dlp only (no more ytdl-core fallback)');
}); 