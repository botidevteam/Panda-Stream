module.exports = {
    async function(Streaming_User, dataStream, Compact_Mode) {
        /**
         * @param {Object} Streaming_User The user object (of the database)
         * @param {Object} dataStream The data of the streaming channnel (using twitch extension)
         * @param {Boolean} Compact_Mode Using 0 (false) mean normal | Using 1 (true) mean compacted mode
         */
        const bot = require("../bot")
            , Util = require("../Util")
            , Discord = require("discord.js")
            , colors = require("colors")
            , i18n = require("../i18n")

        let ServerLang = ""
        await Util.SQL_GetServerID(Util.db_Model.servers, Streaming_User.ServerID).then(results => {
            if (!results) return console.error("CANT FIND THE SERVERLANG");
            else {
                //console.log(results.ServerLang)
                ServerLang = results.ServerLang
            }
        })

        let dataStream_Game
        if (Streaming_User.Compact_Mode != null || Streaming_User.Compact_Mode != undefined) {
            if (Streaming_User.Compact_Mode == 1 || Streaming_User.Compact_Mode == true) {
                Compact_Mode = true
            } else {
                Compact_Mode = false
            }
        } else {
            Compact_Mode = false
        }

        if (!dataStream.stream.game) {
            //dataStream_Game = "Nothing (No data found in his profile)"
            dataStream_Game = i18n.function(ServerLang).Announce_No_GameData_Found

        } else { dataStream_Game = dataStream.stream.game }

        let embed_to_send = new Discord.MessageEmbed()
            .setColor("PURPLE")
            .setFooter(`${bot.bot.user.username} ${i18n.function(ServerLang).Announce_Footer_Pub}`, bot.bot.user.avatarURL)
            .setTimestamp();

        //For preview : .setThumbnail(dataStream.stream.preview.large)
        //For logo : .setThumbnail(dataStream.stream.channel.logo)

        switch (Compact_Mode) {
            case true:
                embed_to_send
                    .setTitle(dataStream.stream.channel.name)
                    .setURL(dataStream.stream.channel.url)
                    .setThumbnail(dataStream.stream.channel.logo)
                    .addField(i18n.function(ServerLang).Announce_Now_Playing, dataStream_Game)
                    .addField(i18n.function(ServerLang).Announce_Stream_Title, dataStream.stream.channel.status)
                break;

            case false:
                embed_to_send
                    .setTitle(`${dataStream.stream.channel.name} ${i18n.function(ServerLang).Announce_Now_Streaming}`) //, `https://i.ibb.co/NF3XdbK/twitch-logo.jpg`)
                    .setURL(dataStream.stream.channel.url)
                    .setThumbnail(dataStream.stream.channel.logo)
                    .addField(i18n.function(ServerLang).Announce_Now_Playing, dataStream_Game)
                    .addField(i18n.function(ServerLang).Announce_Stream_Title, dataStream.stream.channel.status)
                    .addField(i18n.function(ServerLang).Announce_Stream_Followers, dataStream.stream.channel.followers, true)
                    .addField(i18n.function(ServerLang).Announce_Stream_TotalViews, dataStream.stream.channel.views, true)
                    .setImage(dataStream.stream.preview.large)
                break;
        }

        const User_Server = bot.bot.guilds.resolve(Streaming_User.ServerID)
        const User_Channel = bot.bot.channels.resolve(Streaming_User.ChannelID)

        if (User_Channel.type == "text") {

            User_Channel.send(Streaming_User.Stream_Text, {
                embed: embed_to_send
            })
                .then(msg => {
                    //console.log(colors.cyan(`The data of the msg sended is : ${msg.id}`))

                    bot.con.query(`UPDATE ${Util.db_Model.queue} SET MessageID = '${msg.id}' WHERE UserTwitch = '${Streaming_User.UserTwitch}' AND ServerID = '${Streaming_User.ServerID}' AND ChannelID = '${Streaming_User.ChannelID}'`, (error) => {
                        if (error) console.error(error)
                        else {
                            console.log(colors.cyan(`Added`))
                            console.log(colors.cyan(`UPDATE ${Util.db_Model.queue} SET MessageID = '${msg.id}' WHERE UserTwitch = '${Streaming_User.UserTwitch}' AND ServerID = '${Streaming_User.ServerID}' AND ChannelID = '${Streaming_User.ChannelID}'`))
                        }
                    })
                })

        }
    }
}