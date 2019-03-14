module.exports = {
    function(Streaming_User, dataStream, Compact_Mode) {
        /**
         * @param {Object} Streaming_User The user object (of the database)
         * @param {Object} dataStream The data of the streaming channnel (using twitch extension)
         * @param {Boolean} Compact_Mode Using 0 (false) mean normal | Using 1 (true) mean compacted mode
         */
        const bot = require("../bot")
            , Util = require("../Util")
            , Discord = require("discord.js")

        if (!Compact_Mode) Compact_Mode = false


        let embed_to_send = new Discord.RichEmbed()
            .setColor("PURPLE")
            .setFooter(`${bot.bot.user.username} is a streaming bot | Best Streaming Latence`, bot.bot.user.avatarURL)
            .setTimestamp()

        //For preview : .setThumbnail(dataStream.stream.preview.large)
        //For logo : .setThumbnail(dataStream.stream.channel.logo)

        switch (Compact_Mode) {
            case true:
                embed_to_send
                    .setTitle(dataStream.stream.channel.name)
                    .setURL(dataStream.stream.channel.url)
                    .setThumbnail(dataStream.stream.channel.logo)
                    .addField(`Now Playing`, dataStream.stream.game)
                    .addField(`Stream Title`, dataStream.stream.channel.status)
                break;

            case false:
                embed_to_send
                    .setAuthor(`${dataStream.stream.channel.name} is now streaming!`, `https://i.ibb.co/NF3XdbK/twitch-logo.jpg`)
                    .setURL(dataStream.stream.channel.url)
                    .setThumbnail(dataStream.stream.channel.logo)
                    .addField(`Now Playing`, dataStream.stream.game)
                    .addField(`Stream Title`, dataStream.stream.channel.status)
                    .addField(`Followers`, dataStream.stream.channel.followers, true)
                    .addField(`Total Views`, dataStream.stream.channel.views, true)
                break;
        }

        const User_Server = bot.bot.guilds.find(g => g.id == Streaming_User.ServerID)
        const User_Channel = bot.bot.channels.find(c => c.id == Streaming_User.ChannelID)

        if (User_Channel.type == "text") {
            User_Channel.send(embed_to_send)
                .then(msg => {
                    console.log(`The data of the msg sended is : ${msg.id}`)

                    bot.con.query(`UPDATE ${Util.db_Model.queue} SET MessageID = '${msg.id}' WHERE UserID = ${Streaming_User.UserID}`, (error) => {
                        if (error) console.error(error)
                    })
                })
        }
    }
}