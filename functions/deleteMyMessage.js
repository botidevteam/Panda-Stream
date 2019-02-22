module.exports = {
    function(message, time) {
        if (time === null) time = 750

        if (!message.author.name === bot.user.name || !message.author.name === bot.user.username) return message.delete(time)
            .catch(error => (console.log(`Function deleteMyMessage got an error: ${error}`)));
    }
}