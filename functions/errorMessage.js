module.exports = {
    /**
     * @param {Error} error Get the error message (err)
     * @param {String} cmd_name Get the command (if it is not let blank) of the error 
     * @param returns Return the embed_message in the good format for your message
     */
    function(error, cmd_name) {
        const bot = require("../bot").bot
            , Util = require("../Util")
            , discord = require("discord.js")

        var embed_txt = new discord.MessageEmbed()
        if (cmd_name) {
            embed_txt.setColor("RED")
                .setDescription(`Error in your ${cmd_name}!\n\n${error.message}`)
                .setTimestamp()
        } else {
            embed_txt.setColor("RED")
                .setDescription(`Error!\n\n${error.message}`)
                .setTimestamp()
        }

        return embed_txt
    }
}