class TictactoeCommand {
    constructor() {
        this.name = 'tictactoe';
        this.description = 'Play Tic Tac Toe';
    }

    async execute(args, context) {
        return "Tic Tac Toe game coming soon!";
    }
}

module.exports = TictactoeCommand; 