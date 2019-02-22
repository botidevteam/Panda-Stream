module.exports = {
    help: {
        name: "warn"
    },
    run: async (call) => {
        const discord = require('discord.js')
            , Util = require("../Util")
            , SQL = require('../functions/SQL_GetResult.js')
            , config = require('../config.js')
            , bot = require("../bot.js").bot
            , Call = require('../bot.js').Call

        var message = call.message
            , user = call.message.member
            , author = call.message.author


        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(call.args[0]));
        let embed = new Discord.RichEmbed()
            .setDescription("Предупреждение")
            .setColor('#e22216')
            .addField("Administator: ", message.author.username)
            .addField("Warned user: ", `${rUser.user.username}`)
            .addField("Number of warnings: ", `${profile.warns}/3`);
        message.channel.send(embed);
        //rUser.send()

    }
}