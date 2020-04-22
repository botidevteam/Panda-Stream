module.exports = {
    help: {
        //What the command will look || =addBannedUsers
        name: "addNewUsers",
        aliases: ["addnu", "addNU", "addnewuser", "addnewusers"]
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message
            , guild = message.guild
            , i18n = require("../i18n")
            , bot = require("../bot");

        /*
        if (!String(Util.Staff_List).includes(message.author.id))
            return message.reply("You are not allowed to use that command !").then(msg => Util.deleteMyMessage(msg, 10000))
        */
        if (!bot.bot.member_Has_MANAGE_GUILD) { return message.reply("Sorry but you are not allowed to do that command.\nYou need the permission 'MANAGE_GUILD'") }

        let userID
            , userTwitch
            , userChannelID
            , my_message;

        let messageEmbed = new Discord.MessageEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL())
            .setColor("YELLOW")
            .setFooter(bot.bot.user.username + " " + i18n.function(bot.bot.ServerLang).Announce_Footer_Pub)

        //message.channel.send("Send the ID of the user (discordID)").then(msg => my_message = msg)
        messageEmbed.setDescription("Ok, now notify the Discord user (@User)\n\n*(So i can send him a DM when there is a problem)*");
        message.channel.send(messageEmbed).then(msg => my_message = msg)
        //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)

        // Await the messages from the author of the message
        const filter = m => m.author.id === message.author.id
        // Errors: ['time'] treats ending because of the time limit as an error
        setTimeout(() => {
            getUserID();
        }, 1200);

        function getUserID() {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected_UserID => {
                    //console.log(collected_UserID.size)
                    //console.log(collected_UserID.first().mentions.users);

                    //console.log(collected_UserID.first().mentions.users.first());
                    if (collected_UserID.size == 0) {
                        messageEmbed.setDescription("You didn't notify the user ! (@User)");
                        messageEmbed.setColor("RED");
                        return my_message.edit(messageEmbed);
                    } else if (!collected_UserID.first().mentions.users.first().id) {
                        messageEmbed.setDescription("Can't retrieve the user correctly !")
                        messageEmbed.setColor("RED");
                        return my_message.edit(messageEmbed)
                    }
                    userID = collected_UserID.first().mentions.users.first().id

                    collected_UserID.first().delete();
                    messageEmbed.setDescription(`Understand !\nUser: ${Util.NotifyUser(userID)}\n\nCan you provide his UserTwitch ?`);
                    my_message.edit(messageEmbed);

                    getUserTwitch();
                })
                .catch(collected_ID_err => {
                    console.error(collected_ID_err)
                    messageEmbed.setDescription(`After a minute, you didn't send any message.\nCanceling...`)
                    return my_message.edit(messageEmbed)
                        .then(msg => Util.deleteMyMessage(msg, 20 * 1000))
                })
        }

        function getUserTwitch() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_UserTwitch => {
                    //console.log(collected_UserTwitch.size)
                    //console.log(collected_UserTwitch.first())
                    collected_UserTwitch.first().delete();

                    userTwitch = collected_UserTwitch.first().content

                    bot.twitch.getUser(userTwitch)
                        .then(dataUser => {
                            console.log("The user exist");

                            messageEmbed.setDescription(`Understand !\nUser: ${Util.NotifyUser(userID)}\nTwitch username: ${userTwitch}\n\nCan you provide provide the Channel (#Channel) ?\n\n*This will be used to send the notification message*`);
                            my_message.edit(messageEmbed);

                            getChannelID();
                        })
                        .catch(err => {
                            console.error("Can't find the user requested");

                            messageEmbed.setDescription(`The account '${userTwitch}' **doesn't** exist !!`);
                            messageEmbed.setColor("RED");
                            return my_message.edit(messageEmbed);
                        })


                })
                .catch(collected_UserTwitch_err => {
                    console.error(collected_UserTwitch_err)
                    messageEmbed.setDescription(`After a minute, you didn't send any message.\nCanceling...`);
                    messageEmbed.setColor("RED");
                    return my_message.edit(messageEmbed)
                        .then(msg => Util.deleteMyMessage(msg, 20 * 1000));
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })
        }

        function getChannelID() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_ChannelID => {
                    if (collected_ChannelID.size == 0) {
                        messageEmbed.setDescription("You didn't notify the channel ! (#Channel)");
                        messageEmbed.setColor("RED");
                        return my_message.edit(messageEmbed);
                    } else if (!collected_ChannelID.first().mentions.channels.first().id) {
                        messageEmbed.setDescription("Can't retrieve the channel correctly !");
                        messageEmbed.setColor("RED");
                        return my_message.edit(messageEmbed)
                    }
                    //console.log(collected_ChannelID.first())
                    //console.log(collected_ChannelID.size);
                    //console.log(collected_ChannelID.first().mentions.channels.first());
                    collected_ChannelID.first().delete();

                    userChannelID = collected_ChannelID.first().mentions.channels.first().id;

                    //We check if the data is not currently in the DB
                    bot.con.query("SELECT * FROM `Users` WHERE `UserTwitch`" + `LIKE "${userTwitch}" AND \`ServerID\` LIKE "${message.guild.id}"`, (err, results) => {
                        if (err) { return console.error(err); }

                        if (!results || results == null || results == undefined || results == "") {
                            //If not existing in the DB we add it
                            messageEmbed.setDescription(`Okay!\nThe user is now added in the DB\nuserID-${Util.NotifyUser(userID)}\nuserTwitch-${userTwitch}\nuserChannel-${Util.NotifyChannel(userChannelID)}`);
                            messageEmbed.setColor("GREEN");
                            //console.log(userID)
                            Util.SQL_addNewUser_In_DB_Users(userID, userTwitch, message.guild.id, userChannelID, true);
                            return my_message.edit(messageEmbed)
                        } else {
                            console.log("Founded an existing data with the same user and same channel id");
                            console.log(results);

                            results = results[0];
                            console.log(results)
                            //If it exist in the DB we DONT add it
                            messageEmbed.setDescription(`The user is **already** in the DB \n**(note that you can only have 1 notification of the user per server)**\n\n` +
                                `The data you provide to me: userID-${Util.NotifyUser(userID)}\n` +
                                `userTwitch-${userTwitch}\n` +
                                `userChannel-${Util.NotifyChannel(userChannelID)}\n\n` +
                                `The existing data: userID-${Util.NotifyUser(results.UserID)}\n` +
                                `userTwitch-${results.UserTwitch}\n` +
                                `userChannel-${Util.NotifyChannel(results.ChannelID)}`);
                            messageEmbed.setColor("RED");
                            //console.log(userID)
                            //Util.SQL_addNewUser_In_DB_Users(userID, userTwitch, message.guild.id, userChannelID, true);
                            return my_message.edit(messageEmbed)
                        }

                    })


                })
                .catch(collected_ChannelID_err => {
                    console.log(collected_ChannelID_err)
                    my_message.edit(`An error occured: \n${collected_ChannelID_err.message}`)
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })
        }
    }
}
