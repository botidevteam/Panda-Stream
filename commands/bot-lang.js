module.exports = {
    help: {
        //=bot-lang [lang]
        name: "bot-lang",
        dm: false
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , bot = require("../bot")
            , colors = require("colors")
            , message = call.message

        if (!call.bot.member_Has_MANAGE_GUILD) {
            return message.channel.send(Util.notAllowedCommand("bot-lang", "MANAGE_GUILD", message))
        }

        if (!call.args[0] || call.args[0].toLowerCase() == "help") {
            Util.SQL_GetResult(Util.db_Model.servers, "ServerID", message, message.member).then(results => {
                console.log(results)
                /**
                 * @param results.ServerID The server ID
                 * @param results.ServerLang The server lag
                 * @param results.ServerName The server name
                 * @param results.ServerOwnerID The server owner ID
                 * @param results.ServerPrefix The server prefix
                 */

                var embed = new Discord.MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(`The bot lang on this server`, message.member.user.avatarURL)
                    .setDescription(
                        `The current language of the bot on this server is
                    \`\`\`${results.ServerLang}\`\`\`
                    `
                    )

                message.channel.send(embed)
            })
        } else if (call.args[0].toLowerCase() == "set") {
            let _msg = await message.channel.send(`React to this message to define what language the bot should set`)
            await _msg.react("🇫🇷")
            await _msg.react("🇺🇸")

            const reaction_filter = (reaction, user) => (reaction.emoji.name == "🇫🇷" || reaction.emoji.name == "🇺🇸") && user.id === message.author.id
            const collector = _msg.createReactionCollector(reaction_filter, { time: 60000 })
            collector.on('collect', async r => {
                //console.log(`Collected ${r.emoji.name}`)
                await _msg.clearReactions().catch(console.log(`I don't have the permission to remove the reactions ServerID-${message.guild.id}`))

                if (r.emoji.name == "🇫🇷") {
                    _msg.edit(
                        `Defined the bot language to this server to 🇫🇷`
                    )
                    bot.con.query(`UPDATE ${Util.db_Model.servers} SET ServerLang = 'french' WHERE ServerID = '${message.guild.id}'`, (err, results) => {
                        if (err) { console.error(err) }
                    })
                    console.log(colors.green(`Updated the server '${message.guild.name}' because of the ServerLang change`));

                } else if (r.emoji.name == "🇺🇸") {
                    _msg.edit(
                        `Defined the bot language to this server to 🇺🇸`
                    )
                    bot.con.query(`UPDATE ${Util.db_Model.servers} SET ServerLang = 'english' WHERE ServerID = '${message.guild.id}'`, (err, results) => {
                        if (err) { console.error(err) }
                    })
                    console.log(colors.green(`Updated the server '${message.guild.name}' because of the ServerLang change`));

                }
            })

            collector.on('end', collected => {
                if (collected.length == 0) {
                    _msg.clearReactions().catch(console.log(`I don't have the permission to remove the reactions ServerID-${message.guild.id}`))
                    _msg.edit(
                        `------- **Error** -------

You didn't provide any reaction`
                    )
                }
            });
        }
    }
}