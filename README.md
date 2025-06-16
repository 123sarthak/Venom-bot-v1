# Sarthak's Facebook Messenger Bot 🤖

A powerful Facebook Messenger bot created by Sarthak that features a Tic Tac Toe game and video download functionality.

## Features

- 🎮 Tic Tac Toe Game
- 📥 Video Downloader (YouTube, Facebook, Instagram)
- ⚡ Command Prefix System
- 🎯 Easy to use commands

## Commands

- `!help` - Show all available commands
- `!tictactoe` - Start a new Tic Tac Toe game
- `!download <url>` - Download video from URL
- `!about` - About Sarthak's Bot

## Setup Instructions

1. Clone this repository:
```bash
git clone <repository-url>
cd sarthak-messenger-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PAGE_ACCESS_TOKEN=your_facebook_page_access_token
VERIFY_TOKEN=your_custom_verify_token
PORT=3000
PREFIX=!
```

4. Start the bot:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## Facebook Page Setup

1. Create a Facebook Page
2. Create a Facebook App
3. Add the Messenger product to your app
4. Generate a Page Access Token
5. Set up webhooks with your verify token
6. Subscribe your app to the page

## Environment Variables

- `PAGE_ACCESS_TOKEN`: Your Facebook Page Access Token
- `VERIFY_TOKEN`: Custom token for webhook verification
- `PORT`: Port number for the server (default: 3000)
- `PREFIX`: Command prefix (default: !)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 