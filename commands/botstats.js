module.exports = {
    help: {
        name: "status", 
        aliases: ["botstats"]
    },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot").bot
            , Util = require("../Util")
            , config = require("../config")

        var message = call.message
            , member = call.message.member

        let embed = new Discord.MessageEmbed()
            .setTitle('Bot stats')
            .addField('Bot Uptime', Util.time_Into_String(bot.uptime))
            .addField('Version', config.version)
            .setColor(0xffffff)
        message.channel.send(embed)

    }
}