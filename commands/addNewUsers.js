module.exports = {
    help: {
        //What the command will look || =addBannedUsers
        name: "addNewUsers",
        aliases: ["addNU"]
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message
            , guild = message.guild
            , bot = require("../bot")

        if (!String(Util.Staff_List).includes(message.author.id))
            return message.reply("You are not allowed to use that command !").then(msg => Util.deleteMyMessage(msg, 10000))


        let userID
            , userTwitch
            , userChannelID

            , my_message;

        message.channel.send("Send the ID of the user (discordID)").then(msg => my_message = msg)
        //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)

        // Await the messages from the author of the message
        const filter = m => m.author.id === message.author.id
        // Errors: ['time'] treats ending because of the time limit as an error
        getUserID()

        function getUserID() {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected_UserID => {
                    console.log(collected_UserID.size)
                    console.log(collected_UserID.first())

                    if (!parseInt(collected_UserID.first().content)) { return message.reply("That's not an ID !") }
                    userID = collected_UserID.first().content

                    collected_UserID.first().delete()
                    my_message.edit("Understand !\nCan you provide his UserTwitch ?")

                    getUserTwitch()
                })
                .catch(collected_ID_err => {
                    console.log(collected_ID_err)
                    return message.reply(`After a minute, you didn't send any message.\nCanceling...`)
                        .then(msg => Util.deleteMyMessage(msg, 20000))
                })
        }

        function getUserTwitch() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_UserTwitch => {
                    console.log(collected_UserTwitch.size)
                    console.log(collected_UserTwitch.first())
                    collected_UserTwitch.first().delete()

                    userTwitch = collected_UserTwitch.first().content
                    my_message.edit(`Okay\nAnd now can you provide a channelID ? (stream notification)`)

                    getChannelID()
                })
                .catch(collected_UserTwitch_err => {
                    console.log(collected_UserTwitch_err)
                    my_message.edit(`An error occured: \n${collected_UserTwitch_err.message}`)
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })
        }

        function getChannelID() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_ChannelID => {
                    console.log(collected_ChannelID.size)
                    console.log(collected_ChannelID.first())
                    collected_ChannelID.first().delete()

                    userChannelID = collected_ChannelID.first().content
                    my_message.edit(`Okay\nThe user is now added in the DB
                    userID-${userID}
                    userTwitch-${userTwitch}
                    userChannelID-${userChannelID}
                    `)

                    console.log(userID)
                    Util.SQL_addNewUser_In_DB_Users(userID, userTwitch, message.guild.id, userChannelID, true)
                })
                .catch(collected_ChannelID_err => {
                    console.log(collected_ChannelID_err)
                    my_message.edit(`An error occured: \n${collected_ChannelID_err.message}`)
                    //Util.SQL_addBannedUsers(userToBan.id, userToBan.user.tag, "None", message.member.id)
                })
        }
    }
}
