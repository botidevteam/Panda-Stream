module.exports = {
    function() {
        /**
         * @param {Object} Streaming_User The user object (of the database)
         * @param {Object} dataStream The data of the streaming channnel (using twitch extension)
         * @param {Boolean} Compact_Mode Using 0 (false) mean normal | Using 1 (true) mean compacted mode
         * @param MessageID Used to get the Message and then update it
         */
        const bot = require("../bot")
            , Util = require("../Util")
            , Discord = require("discord.js")

        /*
        let embed_to_send = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setFooter(`${bot.bot.user.username} is a streaming bot | Best Streaming Latence`, bot.bot.user.avatarURL)
            .setTimestamp()
        */
        //For preview : .setThumbnail(dataStream.stream.preview.large)
        //For logo : .setThumbnail(dataStream.stream.channel.logo)
        let dataStream_Game

        bot.con.query(`SELECT * FROM ${Util.db_Model.queue}`, async (error, results) => {
            /**
            * @param results.UserID
            * @param results.UserTwitch
            * @param results.ServerID
            * @param results.ChannelID
            * @param results.MessageID
            * @param results.Stream_Text
            * @param results.Remove_MSG_On_End
            * @param results.Compact_Mode
            * @param results.IS_STREAMING
            * @param results.COINS
            */

            if (error) console.error(error)
            if (!results) console.error("No results")

            //console.log(results)

            results.forEach(async Streaming_User => {
                //console.log(Streaming_User)

                bot.twitch.getUser(Streaming_User.UserTwitch)
                    .then(async data => {
                        const dataStream = await data

                        if (dataStream.stream == null || dataStream.stream == undefined) return console.log(`stream is null for ${Streaming_User.UserTwitch}`)
                        //console.log(dataStream)
                        if (!dataStream.stream.game) { dataStream_Game = "Nothing (No data found in his profile)" }
                        else { dataStream_Game = dataStream.stream.game }

                        let embed_to_send

                        switch (Streaming_User.Compact_Mode) {
                            case 1:
                                embed_to_send = new Discord.MessageEmbed()
                                    .setColor("PURPLE")
                                    .setTitle(dataStream.stream.channel.name)
                                    .setURL(dataStream.stream.channel.url)
                                    .setThumbnail(dataStream.stream.channel.logo)
                                    .addField(`Now Playing`, dataStream_Game)
                                    .addField(`Stream Title`, dataStream.stream.channel.status)
                                    .setFooter(`${bot.bot.user.username} is a streaming bot | Best Streaming Latence`, bot.bot.user.avatarURL)
                                    .setTimestamp()
                                break;

                            case 0:
                                embed_to_send = new Discord.MessageEmbed()
                                    .setColor("PURPLE")
                                    .setTitle(`${dataStream.stream.channel.name} is now streaming!`)// , `https://i.ibb.co/NF3XdbK/twitch-logo.jpg`)
                                    .setURL(dataStream.stream.channel.url)
                                    .setThumbnail(dataStream.stream.channel.logo)
                                    .addField(`Now Playing`, dataStream_Game)
                                    .addField(`Stream Title`, dataStream.stream.channel.status)
                                    .addField(`Followers`, dataStream.stream.channel.followers, true)
                                    .addField(`Total Views`, dataStream.stream.channel.views, true)
                                    .setImage(dataStream.stream.preview.large)
                                    .setFooter(`${bot.bot.user.username} is a streaming bot | Best Streaming Latence`, bot.bot.user.avatarURL)
                                    .setTimestamp()
                                break;
                        }

                        const User_Server = bot.bot.guilds.resolve(Streaming_User.ServerID)
                        const User_Channel = bot.bot.channels.resolve(Streaming_User.ChannelID)

                        if (User_Channel && User_Channel.type == "text") {
                            User_Channel.fetchMessage(Streaming_User.MessageID)
                                .then(async msg => {
                                    //console.log("Finded the message")
                                    await msg.edit(embed_to_send)
                                })
                                .catch(console.error)
                        }
                    })
                    .catch(console.error)
            });

        })

    }
}