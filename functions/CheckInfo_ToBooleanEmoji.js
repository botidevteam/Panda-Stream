module.exports = {
    function(value_boolean, text_boolean) {
        if (value_boolean) {
            if (text_boolean) return `Yes ${bot.EmojiGreenTickString}`
            else return bot.EmojiGreenTickString
        } else {
            if (text_boolean) return `No ${bot.EmojiRedTickString}`
            else return bot.EmojiRedTickString
        }
    }
}