module.exports = {
    function(value_boolean, text_boolean) {
        const Util = require("../Util")
        if (value_boolean) {
            if (text_boolean) return `Yes ${Util.EmojiGreenTickString}`
            else return Util.EmojiGreenTickString
        } else {
            if (text_boolean) return `No ${Util.EmojiRedTickString}`
            else return Util.EmojiRedTickString
        }
    }
}