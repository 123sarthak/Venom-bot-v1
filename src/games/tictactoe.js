const { formatText } = require('../utils/textFormatter');

class TicTacToe {
    constructor() {
        this.games = new Map();
    }

    startGame(userId, mentionedId = null) {
        // Check if either player already has an active game
        if (this.games.has(userId) || (mentionedId && this.games.has(mentionedId))) {
            return formatText('❌ One of the players already has an active game! Finish it first.');
        }

        // Create a unique game ID using both players' IDs
        const gameId = mentionedId ? `${userId}_${mentionedId}` : userId;

        this.games.set(gameId, {
            board: Array(9).fill(' '),
            currentPlayer: 'X',
            moves: 0,
            players: {
                X: userId,
                O: mentionedId || 'AI'
            },
            isTwoPlayer: !!mentionedId
        });

        const game = this.games.get(gameId);
        const opponentName = mentionedId ? `<@${mentionedId}>` : 'AI';

        return formatText(
            '🎮 New Tic Tac Toe game started!\n\n' +
            `Player X: <@${userId}>\n` +
            `Player O: ${opponentName}\n\n` +
            this.formatBoard(gameId) + '\n\n' +
            'Use !tictactoe <position> to make a move.\n' +
            'Positions are numbered 1-9, from left to right, top to bottom.\n' +
            'Example: !tictactoe 5 for the center position.'
        );
    }

    makeMove(userId, position) {
        // Find the game where this user is a player
        let gameId = null;
        for (const [id, game] of this.games.entries()) {
            if (game.players.X === userId || game.players.O === userId) {
                gameId = id;
                break;
            }
        }

        if (!gameId) {
            return formatText('❌ No active game found. Start a new game with !tictactoe [@mention]');
        }

        const game = this.games.get(gameId);
        
        // Check if it's the player's turn
        const playerSymbol = game.players.X === userId ? 'X' : 'O';
        if (game.currentPlayer !== playerSymbol) {
            const currentPlayer = game.currentPlayer === 'X' ? 
                `<@${game.players.X}>` : 
                (game.players.O === 'AI' ? 'AI' : `<@${game.players.O}>`);
            return formatText(`❌ It's ${currentPlayer}'s turn!`);
        }

        const pos = parseInt(position) - 1;
        if (isNaN(pos) || pos < 0 || pos > 8) {
            return formatText('❌ Invalid position! Use a number between 1 and 9.');
        }

        if (game.board[pos] !== ' ') {
            return formatText('❌ That position is already taken!');
        }

        game.board[pos] = game.currentPlayer;
        game.moves++;

        const winner = this.checkWinner(game.board);
        if (winner) {
            const winnerId = game.players[winner];
            const winnerName = winnerId === 'AI' ? 'AI' : `<@${winnerId}>`;
            this.games.delete(gameId);
            return formatText(
                `🎉 ${winnerName} wins!\n\n` +
                this.formatBoard(gameId)
            );
        }

        if (game.moves === 9) {
            this.games.delete(gameId);
            return formatText(
                '🤝 Game ended in a tie!\n\n' +
                this.formatBoard(gameId)
            );
        }

        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        const nextPlayer = game.currentPlayer === 'X' ? 
            `<@${game.players.X}>` : 
            (game.players.O === 'AI' ? 'AI' : `<@${game.players.O}>`);

        return formatText(
            `🎮 ${nextPlayer}'s turn!\n\n` +
            this.formatBoard(gameId)
        );
    }

    checkWinner(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const [a, b, c] of lines) {
            if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    formatBoard(gameId) {
        const game = this.games.get(gameId);
        if (!game) return '';

        const board = game.board.map(cell => cell === ' ' ? '⬜' : (cell === 'X' ? '❌' : '⭕'));
        return [
            `${board[0]} | ${board[1]} | ${board[2]}`,
            '─────────',
            `${board[3]} | ${board[4]} | ${board[5]}`,
            '─────────',
            `${board[6]} | ${board[7]} | ${board[8]}`
        ].join('\n');
    }
}

module.exports = TicTacToe; 