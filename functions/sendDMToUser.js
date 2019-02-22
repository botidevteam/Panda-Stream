module.exports = {
    function(message, msgToSend) {
        message.author.createDM()
            .catch(e => {
                if (e.name === "DiscordAPIError") return message.reply("Sorry but i can't DM you, open your DM please.")
            })

        message.author.send(msgToSend)
            .catch(e => {
                if (e.name === "DiscordAPIError") {
                    return message.reply("Sorry but i can't DM you, open your DM please.").then(msg => bot.deleteMyMessage(msg, 10000))
                }
            })
    }
}