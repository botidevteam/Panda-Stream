module.exports = {
    help: {
        name: "coins"
    },
    run: async (call) => {
        const discord = require('discord.js')
            , Util = require("../Util")
            , config = require('../config.js')
            , bot = require("../bot.js").bot

        var message = call.message
            , member = call.message.member
            , author = call.message.author
        let coins = Util.SQL_GetUserStats(author.id);

        //:lulz: - 549654952457404416
        let embed = new discord.MessageEmbed()
            .setDescription('Profile')
            .setColor('#c8385a')
            .addField("🌝 Coins", Util.EmojiThinkingString)
            .setFooter('Туть был котя');
        message.channel.send(embed)

    }
}