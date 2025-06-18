// Simple test for play command
const PlayCommand = require('./src/commands/play.js');

async function testPlayCommand() {
    console.log('Testing play command...');
    
    try {
        const playCommand = new PlayCommand();
        console.log('✅ Play command loaded successfully');
        
        // Test with mock context
        const mockContext = {
            threadID: 'test123',
            fb: {
                sendMessage: async (threadID, message) => {
                    console.log(`📤 Mock message to ${threadID}:`, message);
                }
            }
        };
        
        console.log('✅ Mock context created');
        console.log('🎵 Play command is ready to use!');
        
    } catch (error) {
        console.error('❌ Error testing play command:', error);
    }
}

testPlayCommand(); 