module.exports = {
    help: {
        name: "serverinfo"

    },
    run: async (call) => {
        const discord = require('discord.js')
            , Util = require("../Util")
            , bot = require("../bot.js").bot

        var message = call.message
            , member = call.message.member
            , author = call.message.author
            , guild = call.message.guild

        const embed = new discord.MessageEmbed()
            .setTitle("Server info")
            .setAuthor(message.author)
            .addField("users", guild.members.memberCount, true)
            .setImage(guild.iconURL)

        message.channnel.send(embed)
    }
}