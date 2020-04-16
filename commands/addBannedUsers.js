module.exports = {
    help: {
        //What the command will look || =addBannedUsers
        name: "addBannedUsers",
        aliases: ["addBU"]
    },
    run: async (call) => {
        const Util = require("../Util")
            , Discord = require("discord.js")
            , message = call.message
            , guild = message.guild
            , bot = require("../bot")

        if (!String(Util.Staff_List).includes(message.author.id))
            return message.reply("You are not allowed to use that command !").then(msg => Util.deleteMyMessage(msg, 10000))


        let userToBan
            , userToBanID
            , userBanReason

            , my_message;
        message.channel.send("Send the ID of the user (it will be banned from the bot)").then(msg => my_message = msg)
        //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)

        // Await the messages from the author of the message
        const filter = m => m.author.id === message.author.id
        // Errors: ['time'] treats ending because of the time limit as an error
        getID()

        function getID() {
            message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected_ID => {
                    //console.log(collected_ID.size)
                    //console.log(collected_ID.first())

                    if (!parseInt(collected_ID.first().content)) { return message.reply("That's not an ID !") }

                    userToBan = bot.bot.users.resolve(collected_ID.first().content)

                    if (!userToBan) {
                        userToBan = collected_ID.first().content
                        userToBanID = collected_ID.first().content
                    } else {
                        userToBanID = userToBan.id
                    }
                    //userToBan = collected_ID.first().member
                    collected_ID.first().delete()
                    my_message.edit("Understand !\nCan you provide a reason of his ban ? (wait 30s if you don't want to put a reason)")

                    getReason()
                })
                .catch(collected_ID_err => {
                    console.log(collected_ID_err)
                    return message.reply(`After a minute, you didn't send any message.\nCanceling...`)
                        .then(msg => Util.deleteMyMessage(msg, 20000))
                })
        }

        function getReason() {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected_Reason => {
                    //console.log(collected_Reason.size)
                    //console.log(collected_Reason.first())
                    collected_Reason.first().delete()
                    userBanReason = collected_Reason.first().content
                    my_message.edit(`Okay\nThe user with the following ID and reason will be banned\n\nID: '${userToBanID}'\n\nReason: ${userBanReason}`)

                    //console.log(userToBan)
                    if (userToBan.id != null) { Util.SQL_addBannedUsers(userToBanID, userToBan.tag, userBanReason, message.member.id) }
                    else { Util.SQL_addBannedUsers(userToBanID, userToBan, userBanReason, message.member.id) }
                })
                .catch(collected_Reason_err => {
                    console.log(collected_Reason_err)
                    my_message.edit(`An error occured: \n${collected_Reason_err.message}`)
                    //Util.SQL_addBannedUsers(userToBanID, userToBan.user.tag, "None", message.member.id)
                })
        }

    }
}
