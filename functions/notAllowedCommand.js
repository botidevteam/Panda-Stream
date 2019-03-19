module.exports = {
    function(command, needed_permission, message) {
        const Discord = require("discord.js")
            , bot = require("../bot")
            , Util = require("../Util")

        const embed_Message = new Discord.RichEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)
            .setDescription(
                `You are not allowed to use the **${command}** command
                You need the permission **${needed_permission}** !`
            )
            .setColor("RED")
            .setFooter(`Command requested by ${message.author.tag}`)
            .setTimestamp()

        return message.channel.send(embed_Message)
    }
}