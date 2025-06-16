class StatsCommand {
    constructor() {
        this.name = 'stats';
        this.description = 'Shows bot statistics';
    }

    async execute(args, context) {
        return "Bot stats: (add your stats here)";
    }
}

module.exports = StatsCommand; 