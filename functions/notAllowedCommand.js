module.exports = {
    function(command, needed_permission, message) {
        const Discord = require("discord.js")
            , bot = require("../bot")
            , i18n = require("../i18n")
            , Util = require("../Util")

        const embed_Message = new Discord.MessageEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)
            .setDescription(String(i18n.function(bot.ServerLang).notAllowedCommand_Description).replace("{1}", command).replace("{2}", needed_permission))
            .setColor("RED")
            .setFooter(`${i18n.function(bot.ServerLang).Command_Requested_By} ${message.author.tag}`)
            .setTimestamp()

        return message.channel.send(embed_Message)
    }
}