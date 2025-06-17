# 🤖 Sarthak's Bot v1.0.0

A powerful Facebook Messenger bot with games, utilities, and admin features.

## 🎯 Features

### 🎮 Games
- **Tic Tac Toe** - Play the classic game with friends
- Interactive game board with emoji
- Support for multiple simultaneous games

### 📋 Commands
- **!help** - Show all available commands
- **!info** - Bot information and command list
- **!about** - About the bot and developer
- **!stats** - Show bot statistics (admin stats for admins)
- **!download** - Download videos from URLs (Facebook videos supported)

### 👑 Admin Commands
- **!broadcast** - Send message to all groups
- **!addgroup** - Add current group to bot's list
- **!removegroup** - Remove current group from bot's list
- **!listgroups** - List all groups where bot is active

### 👋 Welcome/Goodbye Messages
- **Automatic welcome messages** when someone joins the group
- **Goodbye messages** when someone leaves
- **Randomized messages** with emojis for variety
- **Cool and friendly** messaging style

### 🤖 Smart Features
- **Default message** when only `!` is used: "Command ta lekha babu!"
- **Error handling** with user-friendly messages
- **Admin permission system**
- **Real-time statistics**

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/123sarthak/Venom-bot-v1.git
   cd Venom-bot-v1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file with:
   ```
   FB_EMAIL=your_facebook_email
   FB_PASSWORD=your_facebook_password
   ADMIN_IDS=your_facebook_id,another_admin_id
   ```

4. **Run the bot:**
   ```bash
   npm start
   ```

## 📱 Usage

### Basic Commands
- `!help` - See all commands
- `!info` - Bot information
- `!about` - About the bot
- `!stats` - Bot statistics

### Gaming
- `!tictactoe` - Start a new game
- `!tictactoe <position>` - Make a move (1-9)

### Utilities
- `!download <url>` - Download video from URL

### Admin Commands
- `!broadcast <message>` - Send to all groups
- `!addgroup` - Add current group
- `!removegroup` - Remove current group
- `!listgroups` - List all groups

## 🎮 Tic Tac Toe Game

The bot supports a full Tic Tac Toe game with:
- Interactive emoji board
- Position numbering (1-9)
- Win/tie detection
- Multiple simultaneous games

**Board Layout:**
```
1 | 2 | 3
─────────
4 | 5 | 6
─────────
7 | 8 | 9
```

## 👋 Welcome Messages

When someone joins a group, the bot automatically sends a welcome message with:
- Friendly greetings
- Command suggestions
- Tips for getting started
- Random message variety

## 🚪 Goodbye Messages

When someone leaves a group, the bot sends a goodbye message with:
- Farewell wishes
- Encouragement to return
- Community appreciation
- Random message variety

## 🔧 Configuration

### Bot Configuration (`src/config/botConfig.js`)
- Prefix: `!`
- Admin IDs from environment variables
- Command cooldown settings
- Bot information

### Environment Variables
- `FB_EMAIL` - Facebook login email
- `FB_PASSWORD` - Facebook login password
- `ADMIN_IDS` - Comma-separated list of admin Facebook IDs

## 📁 Project Structure

```
src/
├── commands/          # Command modules
│   ├── info.js
│   ├── help.js
│   ├── about.js
│   ├── stats.js
│   ├── download.js
│   ├── broadcast.js
│   ├── addgroup.js
│   ├── removegroup.js
│   └── listgroups.js
├── games/             # Game modules
│   └── tictactoe.js
├── handlers/          # Event handlers
│   └── welcomeHandler.js
├── utils/             # Utility modules
│   ├── facebookApi.js
│   ├── textFormatter.js
│   └── database.js
├── config/            # Configuration
│   └── botConfig.js
└── index.js           # Main bot file
```

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

### Production Deployment
```bash
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](license.txt) file for details.

## 👨‍💻 Author

**Sarthak** - Creator and maintainer of Sarthak's Bot

## 🆘 Support

If you encounter any issues or have questions:
1. Check the command list with `!help`
2. Review the bot information with `!info`
3. Contact the developer

---

**🎉 Enjoy using Sarthak's Bot! 🎉** 