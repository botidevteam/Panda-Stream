module.exports = {
    function(DM_UserID, Streaming_User, Invalid_Value) {
        /**
         * @param {ID} DM_UserID The UserID
         * @param {Object} Streaming_User The user object (of the database)
         * @param {String} Invalid_Value The invalid value to notify about (like: ServerID / Provided Server)
         */
        const bot = require("../bot")
            , Util = require("../Util")
            , Discord = require("discord.js")


        let ServerID = Streaming_User.ServerID
            , ChannelID = Streaming_User.ChannelID

        const User_Server = bot.bot.guilds.find(g => g.id == Streaming_User.ServerID)
        if (User_Server) ServerID = `${User_Server.name} - ${Streaming_User.ServerID}`

        const User_Channel = bot.bot.channels.find(c => c.id == Streaming_User.ChannelID)
        if (User_Channel && User_Channel.type == "text") ChannelID = `${User_Channel.name} - ${Streaming_User.ChannelID}`

        let embed = new Discord.RichEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)
            .setDescription(
                `Hello, you are receiving this message because you are/used the bot for your stream notification! *(Thank you for that)*
                The bot **caught an error** while you are streaming and **you will need to re-add something below**:


                You've got an error on your data: **'${Invalid_Value}'**
                For the server: **'${ServerID}'**
                For the channel: **'${ChannelID}'**
                `)
            .setColor("RED")
            .setTimestamp()

        const user = bot.bot.users.find(u => u.id == DM_UserID)
        if (user) user.createDM()
            .then(c => {
                console.log(`Sended invalid DM value '${Invalid_Value}' to ${user.tag}`)
                c.send(embed)
            })

        bot.con.query(`UPDATE ${Util.db_Model.users} SET IS_STREAMING = '${false}' WHERE UserTwitch = '${Streaming_User.UserTwitch}' AND ServerID = '${Streaming_User.ServerID}' AND ChannelID = '${Streaming_User.ChannelID}'`, (error) => {
            if (error) console.error(error)
        })

        bot.con.query(`UPDATE ${Util.db_Model.users} SET ${Invalid_Value} = NULL WHERE UserTwitch = '${Streaming_User.UserTwitch}' AND ServerID = '${Streaming_User.ServerID}' AND ChannelID = '${Streaming_User.ChannelID}'`, (error) => {
            if (error) console.error(error)
        })
    }
}