module.exports = {
    help: {
        //=say [message]
        name: "say",
        dm: false
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message
            , config = require("../config")
            , bot = require("../bot").bot


        if (!call.bot.member_Has_MANAGE_GUILD) {
            return message.reply(Util.notAllowedCommand("prefix", "MANAGE_GUILD"))
        }

        if (!call.args[0]) {
            return message.reply("You didn't notice any message to send")
        } else {
            if (message.deletable) await message.delete(500)
            return message.channel.send(call.content)
        }
    }
}
