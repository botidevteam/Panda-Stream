module.exports = {
    function(message, time) {
        const bot = require("../bot").bot
        if (time == null) { time = 750 }

        if (message.author.id === bot.user.id) return message.delete({ timeout: Math.round(time / 1000) })
            .catch(error => (console.log(`Function deleteMyMessage got an error: ${error}`)));
    }
}