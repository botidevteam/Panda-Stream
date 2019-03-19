module.exports = {
    help: {
        //=bot-lang [lang]
        name: "bot-lang",
        dm: false
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message

        if (!call.bot.member_Has_MANAGE_GUILD) {
            return message.channel.send(Util.notAllowedCommand("prefix", "MANAGE_GUILD", message))
        }
        
        Util.SQL_GetResult(Util.db_Model.servers, "ServerID", message, message.member).then(results => {
            console.log(results)
            /**
             * @param results.ServerID The server ID
             * @param results.ServerLang The server lag
             * @param results.ServerName The server name
             * @param results.ServerOwnerID The server owner ID
             * @param results.ServerPrefix The server prefix
             */

            var embed = new Discord.RichEmbed()
                .setColor("GREEN")
                .setAuthor(`The bot lang of the bot on the server`, message.member.user.avatarURL)
                .setDescription(
                    `The current language of the bot on this server is
                    \`\`\`${results.ServerLang}\`\`\`
                    `
                )

            message.channel.send(embed)
        })
    }
}
