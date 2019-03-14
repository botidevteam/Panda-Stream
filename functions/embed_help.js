module.exports = {
    function(command) {
        const bot = require("../bot").bot
            , Util = require("../Util")
            , Discord = require("discord.js")

        var embed = new Discord.RichEmbed()
        .setDescription(
            `It seems that you need some help for the command ${command}
            To use ${command}
            `
            )

    }
}