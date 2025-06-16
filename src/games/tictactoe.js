class TicTacToe {
    constructor() {
        this.games = new Map(); // Store active games
    }

    startGame(playerId) {
        const board = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9']
        ];
        
        this.games.set(playerId, {
            board,
            currentPlayer: 'X',
            moves: 0
        });

        return this.formatBoard(board) + "\n\nGame started! You're X. Use numbers 1-9 to make your move.";
    }

    makeMove(playerId, position) {
        const game = this.games.get(playerId);
        if (!game) {
            return "No active game found. Start a new game with !tictactoe";
        }

        const pos = parseInt(position) - 1;
        if (isNaN(pos) || pos < 0 || pos > 8) {
            return "Invalid move! Please use numbers 1-9.";
        }

        const row = Math.floor(pos / 3);
        const col = pos % 3;

        if (game.board[row][col] === 'X' || game.board[row][col] === 'O') {
            return "That position is already taken! Try another move.";
        }

        game.board[row][col] = game.currentPlayer;
        game.moves++;

        const board = this.formatBoard(game.board);
        const winner = this.checkWinner(game.board);
        
        if (winner) {
            this.games.delete(playerId);
            return `${board}\n\n${winner} wins! 🎉`;
        }

        if (game.moves === 9) {
            this.games.delete(playerId);
            return `${board}\n\nIt's a tie! 🤝`;
        }

        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        return `${board}\n\n${game.currentPlayer}'s turn. Use numbers 1-9 to make your move.`;
    }

    formatBoard(board) {
        return board.map(row => row.join(' | ')).join('\n' + '-'.repeat(9) + '\n');
    }

    checkWinner(board) {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i];
            }
        }

        // Check diagonals
        if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return board[0][0];
        }
        if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return board[0][2];
        }

        return null;
    }
}

module.exports = { TicTacToe }; 