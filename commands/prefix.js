module.exports = {
    help: {
        //=prefix [prefix]
        name: "prefix",
        dm: false
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message
            , config = require("../config")

        if (!call.bot.member_Has_MANAGE_GUILD) {
            return message.reply(Util.notAllowedCommand("prefix", "MANAGE_GUILD"))
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
            var embed_help = new Discord.RichEmbed()
                .setColor("ORANGE")
                .setFooter(`Command Requested by ${message.member.user.tag}`)

            var embed = new Discord.RichEmbed()
                .setColor("GREEN")
                .setAuthor(`The prefix of the server`, message.member.user.avatarURL)
                .setDescription(`The current prefix of this server is
                    \`\`\`${results.ServerPrefix}\`\`\`
                    `
                )
                .setFooter(`Command Requested by ${message.member.user.tag}`)

            if (!call.args[0]) {
                message.react(Util.EmojiGreenTickString).then(() => message.delete(5000))
                message.channel.send(embed)
            } else {
                if (call.args[0] === "help") {
                    message.react(Util.EmojiGreenTickString).then(() => message.delete(5000))

                    embed_help.setDescription(`To set the prefix use:
                    \`\`\`Exemple: ${config.prefix}prefix set YourPrefix\`\`\`
                    `
                    )

                    message.channel.send(embed_help)
                } else if (call.args[0] === "set") {
                    if (!call.args[1]) {
                        message.react(Util.EmojiRedTickString).then(() => message.delete(5000))
                        message.channel.send(`You forgot to put the new prefix of the server!`).then(() => Util.deleteMyMessage(message, 6000))
                    } else {
                        if (call.args[1].length <= 1) {
                            message.react(Util.EmojiRedTickString).then(() => message.delete(5000))
                            message.channel.send(`You can't put a prefix smaller than 2 caracters !`).then(() => Util.deleteMyMessage(message, 6000))
                        } else if (call.args[1].length >= 10) {
                            message.react(Util.EmojiRedTickString).then(() => message.delete(5000))
                            message.channel.send(`You can't put a prefix bigger than 10 caracters !`).then(() => Util.deleteMyMessage(message, 6000))
                        } else {
                            call.bot.con.query(`UPDATE ${Util.db_Model.servers} SET ServerPrefix = '${call.args[1]}' WHERE ServerID = '${message.guild.id}'`, (error, res) => {
                                if (error) message.channel.send(Util.errorMessage(error, "prefix"))

                                message.channel.send(`Successfully updated the prefix to \`${call.args[1]}\``)
                            })
                        }
                    }

                } else if (call.args[0] === "show") {
                    message.react(Util.EmojiGreenTickString).then(() => message.delete(5000))

                } else if (call.args[0] === "reset") {
                    message.react(Util.EmojiGreenTickString).then(() => message.delete(5000))
                    call.bot.con.query(`UPDATE ${Util.db_Model.servers} SET ServerPrefix = '${config.prefix}' WHERE ServerID = '${message.guild.id}'`, (error, res) => {
                        if (error) message.channel.send(Util.errorMessage(error, "prefix"))

                        message.channel.send(`Successfully reset the prefix of this server to \`${call.args[1]}\``)
                    })
                }
            }
        })

    }
}
