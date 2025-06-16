const { formatText } = require('../utils/textFormatter');

class TicTacToe {
    constructor() {
        this.games = new Map();
    }

    startGame(userId) {
        if (this.games.has(userId)) {
            return formatText('❌ You already have an active game! Finish it first.');
        }

        this.games.set(userId, {
            board: Array(9).fill(' '),
            currentPlayer: 'X',
            moves: 0
        });

        return formatText(
            '🎮 New Tic Tac Toe game started!\n\n' +
            this.formatBoard(userId) + '\n\n' +
            'Your turn! Use !tictactoe <position> to make a move.\n' +
            'Positions are numbered 1-9, from left to right, top to bottom.\n' +
            'Example: !tictactoe 5 for the center position.'
        );
    }

    makeMove(userId, position) {
        const game = this.games.get(userId);
        if (!game) {
            return formatText('❌ No active game found. Start a new game with !tictactoe');
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
            this.games.delete(userId);
            return formatText(
                `🎉 ${winner} wins!\n\n` +
                this.formatBoard(userId)
            );
        }

        if (game.moves === 9) {
            this.games.delete(userId);
            return formatText(
                '🤝 Game ended in a tie!\n\n' +
                this.formatBoard(userId)
            );
        }

        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        return formatText(
            `🎮 ${game.currentPlayer}'s turn!\n\n` +
            this.formatBoard(userId)
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

    formatBoard(userId) {
        const game = this.games.get(userId);
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