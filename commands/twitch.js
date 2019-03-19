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

        const message = call.message
        const filter = m => m.author.id === message.author.id

        let embed_Help = new Discord.RichEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)

            .setColor("ORANGE")
            .setTimestamp()

        let embed_getInfo = new Discord.RichEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)

            .setColor("PURPLE")
            .setTimestamp()

        let embed_Error = new Discord.RichEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)

            .setColor("RED")
            .setTimestamp()


        if (!bot.bot.member_Has_MANAGE_GUILD) return Util.notAllowedCommand(call.cmd, "MANAGE_GUILD", message)
        if (!call.args[0]) return console.log("help command")
        if (String(call.content).toLowerCase().startsWith("add")) {
            embed_getInfo.setDescription(
                `Hey ${Util.NotifyUser(message.member.id)},

                You are adding a Twitch Channel into your server
                
                Provide the **Twitch Channel** to add. 
                
                **(30 seconds remaining)**`
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
                                        
                                        It seems that the TwitchChannel **"${TwitchChannel}"** is already announced in this server!`
                                    )
                                    return my_message.edit(embed_Error)
                                    //WE RETURN THAT IT ALREADY EXIST
                                }

                            }
                        })

                    embed_getInfo.setDescription(
                        `Okay ${Util.NotifyUser(message.member.id)},
        
                        I will add the **${TwitchChannel}** twitch channel in this server

                        Provide the Discord Channel (used to send the Twitch notification) 
                        (Exemple: **${Util.NotifyChannel(message.guild.channels.last().id)}**). 
                        
                        **(30 seconds remaining)**`
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

                        embed_getInfo.setDescription(
                            `Okay ${Util.NotifyUser(message.member.id)},
        
                            I will put the **${TwitchChannel}** channel's notification into the channel **${Util.NotifyChannel(Discord_Channel.id)}**

                            Now use the reaction on this message, should the notification be **deleted** when **${TwitchChannel}** is OFFLINE ?
                        
                            **(30 seconds remaining)**`
                        )
                        my_message.edit(embed_getInfo)
                        my_message.react(Util.EmojiGreenTickString)
                            .then(my_message.react(Util.EmojiRedTickString))


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
                                message_notification = `When he is **offline** the notification **will __be__ removed.**`
                            } else if (r.emoji.name == "❌") {
                                Remove_MSG_Boolean = 0
                                message_notification = `When he is **offline** the notification **will __NOT__ be removed.**`
                            }

                            if (!result) {
                                console.log("Doesn't exist should be good")
                                Util.SQL_addNewUser_In_DB_Users("000000000000000000", TwitchChannel, message.guild.id, Discord_Channel.id, Remove_MSG_Boolean)
                                embed_getInfo.setDescription(
                                    `Successfully added the new user **'${TwitchChannel}'**

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
                                        `It seems that the TwitchChannel **"${TwitchChannel}"** is already announced in this server!`
                                    )
                                    return my_message.edit(embed_Error)
                                    //WE RETURN THAT IT ALREADY EXIST
                                } else {
                                    console.log("We should insert it")
                                    Util.SQL_addNewUser_In_DB_Users("000000000000000000", TwitchChannel, message.guild.id, Discord_Channel.id, Remove_MSG_Boolean)
                                    embed_getInfo.setDescription(
                                        `Successfully added the new user **'${TwitchChannel}'**
    
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
                        my_message.clearReactions()
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

        }

        function SelectAll_Users(UserTwitch) {
            /**
             * @param UserTwitch The UserID
             * @param returns 
             */
            return new Promise(async (resolve, reject) => {
                bot.con.query(`SELECT * FROM ${Util.db_Model.users} WHERE UserTwitch = '${UserTwitch}'`, (err, results) => {
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


        function getChannel() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_Channel => {
                    console.log(collected_Channel.size)
                    console.log(collected_Channel.first())
                    collected_Channel.first().delete()
                    userBanReason = collected_Channel.first().content
                    my_message.edit(`Okay\nThe user with the following ID and reason will be banned\n\nID: '${userToBan.id}'\n\nReason: ${userBanReason}`)

                    console.log(userToBan)
                    if (userToBan != null) { Util.SQL_addBannedUsers(userToBan.id, userToBan.tag, userBanReason, message.member.id) }
                    else { Util.SQL_addBannedUsers(userToBan.id, userToBan, userBanReason, message.member.id) }
                })
                .catch(collected_Reason_err => {
                    console.log(collected_Reason_err)
                    my_message.edit(`An error occured: \n${collected_Reason_err.message}`)
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })
        }


    }
}