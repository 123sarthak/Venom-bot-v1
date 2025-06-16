class DownloadCommand {
    constructor() {
        this.name = 'download';
        this.description = 'Download something';
    }

    async execute(args, context) {
        return "Download command executed!";
    }
}

module.exports = DownloadCommand; 