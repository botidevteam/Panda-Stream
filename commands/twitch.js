module.exports = {
    help: {
        // =twitch add
        name: "twitch",
        dm: false
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , config = require("../config")
            , bot = require("../bot")
            , i18n = require("../i18n")

        const message = call.message
        const filter = m => m.author.id === message.author.id

        let embed_Help = new Discord.MessageEmbed()
            .setAuthor(`${bot.bot.user.username} ${i18n.function(bot.ServerLang).Command_Help}`, bot.bot.user.avatarURL)

            .setColor("YELLOW")
            .setFooter(`${i18n.function(bot.ServerLang).Command_Requested_By} ${message.author.username}`)
            .setTimestamp()

        let embed_getInfo = new Discord.MessageEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)

            .setColor("PURPLE")
            .setTimestamp()

        let embed_Error = new Discord.MessageEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)

            .setColor("RED")
            .setTimestamp()


        if (!bot.bot.BOT_ADMINISTRATORPerm) {
            embed_Error.setDescription(
                `----- EXTREME ERROR -----

**I NEED THE ADMINISTRATOR PERMISSION TO WORK CORRECTLY**`
            )
            return await message.channel.send(embed_Error)
        }
        if (!bot.bot.member_Has_MANAGE_GUILD) return Util.notAllowedCommand(call.cmd, "MANAGE_GUILD", message)

        if (!call.args[0] || String(call.content).toLowerCase().startsWith("help")) {
            /*embed_Help.setDescription(
                `Hey ${Util.NotifyUser(message.author.id)}
            It seems that you need some help to use me !
            
            Okay so to add a new user you need to send in the channel this following command
            \`\`\`
            =twitch add
            \`\`\`
            Then, let the bot give you the directive to add the user :wink:
            
            :mega: Need support from our team ? [Join our support server here](https://discord.me/panda-stream)`
            )*/

            embed_Help
                .setDescription(`[${call.prefix}${call.cmd} help](https://discord.me/panda-stream)\nAdd, modify and remove any following channel in the server`)
                .addField(`Add`, `__Twitch Channel__\n${call.prefix}twitch add`, true)
                .addField(`Remove`, `__Twitch Channel__\n${call.prefix}twitch remove`, true)
                .addField(`Modify`, `__Twitch Channel__\n${call.prefix}twitch modify`)
                .setColor("FFFF00")
            await message.channel.send(embed_Help)
        } else if (String(call.content).toLowerCase().startsWith("add")) {
            embed_getInfo.setDescription(
                `Hey ${Util.NotifyUser(message.member.id)},

You are adding a Twitch Channel into your server

Provide the **Twitch Channel** to add. 

**(60 seconds remaining)**`
            )

            const my_message = await message.channel.send(embed_getInfo)
            let TwitchChannel
                , Discord_Channel

            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected_Channel => {
                    console.log(collected_Channel.size)
                    console.log(collected_Channel.first())
                    collected_Channel.first().delete()
                    TwitchChannel = String(collected_Channel.first().content).toLowerCase()
                    if (TwitchChannel.includes(" ")) return console.log("We should verify THE SPACE")
                    console.log(TwitchChannel);

                    bot.twitch.getUser(TwitchChannel)
                        .then(async data => {
                            const dataStream = await data
                            console.log(dataStream)
                        })
                        .catch(console.error)

                    SelectAll_Users(TwitchChannel)
                        .then(result => {

                            if (result) {
                                //console.log("It already exist, we should verify if it exist in THIS server")
                                //console.log(result)

                                if (result.ServerID == message.guild.id) {
                                    console.log("We should NOT insert it")
                                    embed_Error.setDescription(
                                        `------- **Error** -------

It seems that the TwitchChannel **'${TwitchChannel}'** is already announced in this server!`
                                    )
                                    return my_message.edit(embed_Error)
                                    //WE RETURN THAT IT ALREADY EXIST
                                }

                            }
                        })

                    embed_getInfo.setDescription(
                        `Okay ${Util.NotifyUser(message.member.id)},

I will add the **'${TwitchChannel}'** twitch channel in this server

Provide the **Discord Channel** (used to send the Twitch notification) 
(Exemple: **${Util.NotifyChannel(message.guild.channels.last().id)}**). 

**(60 seconds remaining)**`
                    )
                    my_message.edit(embed_getInfo)



                    getDiscordChannel()
                })
                .catch(collected_Channel_err => {
                    console.log(collected_Channel_err)
                    embed_Error.setDescription(
                        `------- **Error** -------

You didn't provide a **Twitch Channel** !

*Canceling your request...*`
                    )
                    my_message.edit(embed_Error)

                    //my_message.edit(`An error occured: \n${collected_Channel_err.message}`)
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })


            function getDiscordChannel() {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected_DiscordChannel => {
                        console.log(collected_DiscordChannel.size)
                        console.log(collected_DiscordChannel.first())
                        collected_DiscordChannel.first().delete()
                        //var Discord_Channel = collected_DiscordChannel.first().content
                        if (!collected_DiscordChannel.first().mentions) return console.log("please mention a valid discord channel")
                        Discord_Channel = collected_DiscordChannel.first().mentions.channels.first()
                        console.log(Discord_Channel)

                        my_message.react(Util.EmojiGreenTickString).then(() => my_message.react(Util.EmojiRedTickString))
                        embed_getInfo.setDescription(
                            `Okay ${Util.NotifyUser(message.member.id)},

I will put the **${TwitchChannel}** channel's notification into the channel **${Util.NotifyChannel(Discord_Channel.id)}**

Now use the **reaction** on this message, **should the notification be __deleted__ when **${TwitchChannel}** is OFFLINE ?**

**(60 seconds remaining)**`
                        )
                        my_message.edit(embed_getInfo)


                        getReaction_MSG_Delete()
                    })
                    .catch(collected_DiscordChannel_err => {
                        console.log(collected_DiscordChannel_err)
                        //my_message.edit(`An error occured: \n${collected_DiscordChannel_err.message}`)
                        embed_Error.setDescription(
                            `------- **Error** -------

You didn't provide a **Discord Channel** !

*Canceling your request...*`
                        )
                        my_message.edit(embed_Error)
                        //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                    })
            }

            /*
            function getReaction_MSG_Delete() {
                const reaction_filter = (reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id === message.author.id
                my_message.awaitReactions(reaction_filter, { time: 15000 })
                    .then(collected => {
                        console.log(`Collected ${collected.size} reactions`)
                        console.log(collected.first())
                    })
                    .catch(console.error);
            }
            */

            function getReaction_MSG_Delete() {
                const reaction_filter = (reaction, user) => (reaction.emoji.name == "✅" || reaction.emoji.name == "❌") && user.id === message.author.id
                const collector = my_message.createReactionCollector(reaction_filter, { time: 60000 })
                collector.on('collect', r => {
                    //console.log(`Collected ${r.emoji.name}`)
                    my_message.clearReactions()
                    SelectAll_Users(TwitchChannel)
                        .then(result => {
                            var Remove_MSG_Boolean
                                , message_notification
                            if (r.emoji.name == "✅") {
                                Remove_MSG_Boolean = 1
                                message_notification = `When he is **offline** the notification **will __BE__ removed.**`
                            } else if (r.emoji.name == "❌") {
                                Remove_MSG_Boolean = 0
                                message_notification = `When he is **offline** the notification **will __NOT__ be removed.**`
                            }

                            if (!result) {
                                console.log("Doesn't exist should be good")
                                Util.SQL_addNewUser_In_DB_Users("000000000000000000", TwitchChannel, message.guild.id, Discord_Channel.id, Remove_MSG_Boolean)
                                embed_getInfo.setDescription(
                                    `✅ Successfully added the new user **'${TwitchChannel}'**

All his notifications will be sended in the channel ${Util.NotifyChannel(Discord_Channel.id)}

${message_notification}

*Requested by ${Util.NotifyUser(message.author.id)}*`
                                )
                                my_message.edit(embed_getInfo)
                            } else {
                                //It already exist !
                                console.log("It already exist, we should verify if it exist in THIS server")
                                console.log(result)

                                if (result.ServerID == message.guild.id) {
                                    console.log("We should NOT insert it")
                                    embed_Error.setDescription(
                                        `❌ It seems that the TwitchChannel **"${TwitchChannel}"** is already announced in this server!`
                                    )
                                    return my_message.edit(embed_Error)
                                    //WE RETURN THAT IT ALREADY EXIST
                                } else {
                                    console.log("We should insert it")
                                    Util.SQL_addNewUser_In_DB_Users("000000000000000000", TwitchChannel, message.guild.id, Discord_Channel.id, Remove_MSG_Boolean)
                                    embed_getInfo.setDescription(
                                        `✅ Successfully added the new user **'${TwitchChannel}'**

All his notifications will be sended in the channel ${Util.NotifyChannel(Discord_Channel.id)}

${message_notification}

*Requested by ${Util.NotifyUser(message.author.id)}*`
                                    )
                                    my_message.edit(embed_getInfo)
                                }
                            }
                        })

                })

                collector.on('end', collected => {
                    if (collected.length == 0) {
                        my_message.clearReactions().catch(console.log(`I don't have the permission to remove the reactions ServerID-${message.guild.id}`))
                        embed_Error.setDescription(
                            `------- **Error** -------

You didn't provide an answer to the reaction 
(just add a reaction ${Util.EmojiGreenTickString} or ${Util.EmojiRedTickString}) !

*Canceling your request...*`
                        )
                        my_message.edit(embed_Error)
                    }
                });
            }

        } else if (String(call.content).toLowerCase().startsWith("remove")) {
        } else if (String(call.content).toLowerCase().startsWith("modify")) {
            embed_getInfo.setDescription(
                `Hey ${Util.NotifyUser(message.member.id)},

Provide the **Twitch Channel** to modify. 

**(30 seconds remaining)**`
            )

            const my_message = await message.channel.send(embed_getInfo)

            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_Channel => {

                    console.log(collected_Channel.size)
                    console.log(collected_Channel.first())
                    collected_Channel.first().delete()
                    TwitchChannel = String(collected_Channel.first().content).toLowerCase()
                    if (TwitchChannel.includes(" ")) return console.log("We should verify THE SPACE")
                    console.log(TwitchChannel);

                    SelectAll_Users(TwitchChannel, message.guild.id)
                        .then(async result => {

                            if (!result || result == null || result == undefined) {

                                embed_Error.setDescription(
                                    `------- **Error** -------

It seems that the TwitchChannel **'${TwitchChannel}'** is not already announced in this server!`
                                )
                                return my_message.edit(embed_Error)
                            } else {
                                await my_message.react("1\u{20E3}")
                                await my_message.react("2\u{20E3}")

                                embed_getInfo.setDescription(
                                    `Hey ${Util.NotifyUser(message.author.id)}
                                    
                                    What you want to modify ?
                                    
                                    1️⃣ Discord Channel
                                    
                                    2️⃣ Remove message when user is offline`
                                )
                                my_message.edit(embed_getInfo)

                                const reaction_filter = (reaction, user) => (reaction.emoji.name == "1\u{20E3}" || reaction.emoji.name == "2\u{20E3}") && user.id === message.author.id
                                const collector = my_message.createReactionCollector(reaction_filter, { time: 60000 })
                                collector.on('collect', async r => {
                                    //console.log(`Collected ${r.emoji.name}`)
                                    await my_message.clearReactions().catch(console.log(`I don't have the permission to remove the reactions ServerID-${message.guild.id}`))

                                    if (r.emoji.name == "1\u{20E3}") {
                                        //Discord Channel
                                        embed_getInfo.setDescription(
                                            `Okay you want to change the Discord Channel,

**Provide the new discord channel to send the notification.**

(Exemple: **${Util.NotifyChannel(message.guild.channels.last().id)}**). 

**(30 seconds remaining)**`
                                        )
                                        await my_message.edit(embed_getInfo)

                                        getDiscordChannel_Reaction()
                                    } else if (r.emoji.name == "2\u{20E3}") {
                                        //Remove message when user is offline
                                        console.log("2")
                                    }
                                })

                                collector.on('end', collected => {
                                    if (collected.length == 0) {
                                        my_message.clearReactions().catch(console.log(`I don't have the permission to remove the reactions ServerID-${message.guild.id}`))
                                        embed_Error.setDescription(
                                            `------- **Error** -------

You didn't provide an answer to the reaction 
(just add a reaction 1️⃣ or 2️⃣) !

*Canceling your request...*`
                                        )
                                        my_message.edit(embed_Error)
                                    }
                                });
                            }
                        })

                })
                .catch(collected_Channel_err => {
                    console.log(collected_Channel_err)
                    embed_Error.setDescription(
                        `------- **Error** -------

You didn't provide a **Twitch Channel** !

*Canceling your request...*`
                    )
                    my_message.edit(embed_Error)
                })



            function getDiscordChannel_Reaction() {
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(collected_DiscordChannel => {
                        console.log(collected_DiscordChannel.size)
                        console.log(collected_DiscordChannel.first())
                        collected_DiscordChannel.first().delete()
                        //var Discord_Channel = collected_DiscordChannel.first().content
                        if (!collected_DiscordChannel.first().mentions) return console.log("please mention a valid discord channel")
                        Discord_Channel = collected_DiscordChannel.first().mentions.channels.first()
                        console.log(Discord_Channel)

                        my_message.react(Util.EmojiGreenTickString)
                        embed_getInfo.setDescription(
                            `Okay ${Util.NotifyUser(message.member.id)},

I will change the **${TwitchChannel}** channel's notification to the discord channel **${Util.NotifyChannel(Discord_Channel.id)}**`
                        )
                        my_message.edit(embed_getInfo)


                        console.log(`UPDATE ${Util.db_Model.users} SET ChannelID = '${Discord_Channel.id}' WHERE UserTwitch = '${TwitchChannel}' AND ServerID = '${message.guild.id}'`)
                        bot.con.query(`UPDATE ${Util.db_Model.users} SET ChannelID = '${Discord_Channel.id}' WHERE UserTwitch = '${TwitchChannel}' AND ServerID = '${message.guild.id}'`)
                    })
                    .catch(collected_DiscordChannel_err => {
                        console.log(collected_DiscordChannel_err)
                        //my_message.edit(`An error occured: \n${collected_DiscordChannel_err.message}`)
                        embed_Error.setDescription(
                            `------- **Error** -------

You didn't provide a **Discord Channel** !

*Canceling your request...*`
                        )
                        my_message.edit(embed_Error)
                        //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                    })

            }

        }

        function SelectAll_Users(UserTwitch, ServerID) {
            /**
             * @param UserTwitch The UserID
             * @param returns 
             */
            return new Promise(async (resolve, reject) => {
                bot.con.query(`SELECT * FROM ${Util.db_Model.users} WHERE UserTwitch = '${UserTwitch}' AND ServerID = '${ServerID}'`, (err, results) => {
                    /**
                    * @param results.UserID
                    * @param results.UserTwitch
                    * @param results.ServerID
                    * @param results.ChannelID
                    //* @param results.MessageID
                    * @param results.Stream_Text
                    * @param results.Remove_MSG_On_End
                    * @param results.IS_STREAMING
                    * @param results.COINS
                    */
                    if (!err) {
                        if (results == null) {
                            resolve();
                        } else resolve(results[0]);
                    } else reject(err);
                });
            });
        }
    }


}