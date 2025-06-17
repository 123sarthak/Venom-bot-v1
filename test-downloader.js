const VideoDownloader = require('./src/utils/videoDownloader');

async function testVideoDownloader() {
    console.log('🧪 Testing Video Downloader...\n');
    
    const downloader = new VideoDownloader();
    
    // Test URLs
    const testUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.facebook.com/watch?v=123456789',
        'https://www.instagram.com/p/ABC123/',
        'https://example.com/invalid'
    ];
    
    for (const url of testUrls) {
        console.log(`🔗 Testing URL: ${url}`);
        
        try {
            const platform = downloader.detectPlatform(url);
            console.log(`📱 Detected Platform: ${platform || 'Unknown'}`);
            
            if (platform) {
                console.log(`✅ Platform detection working for ${platform}`);
            } else {
                console.log(`❌ Platform not detected (expected for invalid URLs)`);
            }
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('---');
    }
    
    console.log('✅ Video downloader test completed!');
    console.log('📝 Note: This test only checks platform detection, not actual downloads.');
}

// Run the test
testVideoDownloader().catch(console.error); 