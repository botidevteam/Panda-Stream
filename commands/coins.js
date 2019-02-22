module.exports = {
    help: {
        name: "coins"
    },
    run: async (call) => {
        const discord = require('discord.js')
            , Util = require("../Util")
            , config = require('../config.js')
            , bot = require("../bot.js").bot
            , Call = require('../bot.js').Call

        var message = call.message
            , user = call.message.member
            , author = call.message.author


            let usercoins = Util.SQL_GetResult(Util.db_Model.stats, )
        let embed = new discord.RichEmbed()
            .setDescription('Profile')
            .setColor('#c8385a')
            .addField("🌝 Coins", 'You don\`t have money cuze you in russia federation! :flag_ru: :flag_ru: :flag_ru: ')
            .setFooter('Туть был котя');
        message.channel.send(embed)

    }
}