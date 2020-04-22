module.exports = {
    function() {
        const bot = require("../bot")
            , Util = require("../Util")
            , colors = require("colors")

        bot.con.query(`SELECT * FROM ${Util.db_Model.users} ORDER BY IS_STREAMING ASC, ID ASC`, (error_users, results_users) => {
            /**
             * @param results_users.UserID
             * @param results_users.UserTwitch
             * @param results_users.ServerID
             * @param results_users.ChannelID
             * @param results_users.Stream_Text
             * @param results_users.Remove_MSG_On_End
             * @param results_users.IS_STREAMING
             * @param results_users.COINS
             */

            if (error_users) return console.log(error_users);

            const Check_Streaming_User = [];

            results_users.forEach(i_u => {
                if (!i_u.IS_STREAMING) { Check_Streaming_User.push(i_u); }
            });

            if (Check_Streaming_User == "" || Check_Streaming_User == null || Check_Streaming_User == undefined) return; //console.log(`Nothing in the Streaming_User`)
            //Will prevent any call in the db for nothing if nobody is streaming

            //console.log(Check_Streaming_User)

            Check_Streaming_User.forEach(r_u => {
                if (r_u == "" || r_u == null || r_u == undefined) return;
                if (r_u.ServerID == null || r_u.ChannelID == null) return;
                //console.log(colors.green(r_u.UserID)
                SelectAll_Users(r_u.UserTwitch, r_u.ServerID, r_u.ChannelID)
                    .then(result => {
                        if (result) {
                            //console.log(colors.green(`result`))
                            //console.log(result)
                            Verify_Twitch_Status(result)
                        }
                    })
            })
        });

        function addUser(Streaming_User) {
            bot.con.query(`INSERT INTO ${Util.db_Model.queue} (UserID, UserTwitch, ServerID, ChannelID, Stream_Text, Remove_MSG_On_End, IS_STREAMING) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [Streaming_User.UserID,
                Streaming_User.UserTwitch,
                Streaming_User.ServerID,
                Streaming_User.ChannelID,
                Streaming_User.Stream_Text,
                Streaming_User.Remove_MSG_On_End,
                    '1'
                ])
        }

        function SelectAll_Users(UserTwitch, ServerID, ChannelID) {
            /**
             * @param UserTwitch The UserTwitch
             * @param ServerID The ServerID
             * @param ChannelID The ChannelID
             * @param returns 
             */
            return new Promise(async (resolve, reject) => {
                bot.con.query(`SELECT * FROM ${Util.db_Model.users} WHERE UserTwitch = '${UserTwitch}' AND ServerID = '${ServerID}' AND ChannelID = '${ChannelID}'`, (err, results) => {
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

        function SelectAll_Queue(UserTwitch, ServerID, ChannelID) {
            /**
             * @param UserTwitch The UserTwitch
             * @param ServerID The ServerID
             * @param ChannelID The ChannelID
             * @param returns 
             */
            return new Promise(async (resolve, reject) => {
                bot.con.query(`SELECT * FROM ${Util.db_Model.queue} WHERE UserTwitch = '${UserTwitch}' AND ServerID = '${ServerID}' AND ChannelID = '${ChannelID}'`, (err, results) => {
                    /**
                    * @param results.UserID
                    * @param results.UserTwitch
                    * @param results.ServerID
                    * @param results.ChannelID
                    * @param results.MessageID
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

        function Verify_Twitch_Status(Streaming_User) {
            /**
             * @param Streaming_User The Streaming User variable
             */

            //bot.twitch.getUser("squeezielive")
            bot.twitch.getUser(Streaming_User.UserTwitch)
                .then(dataUser => {
                    /* *
                    _id: 33166101328
                    average_fps: 60
                    broadcast_platform: "live"
                    channel: Object { mature: false, status: "Squeezie ► La squad la plus éclatée du jeu (ft Loc…", broadcaster_language: "fr", … }
                    status:"Squeezie ► La squad la plus éclatée du jeu (ft Locklear) #sponsorisé"
                    updated_at:"2019-03-12T20:22:40.323794Z"
                    url:"https://www.twitch.tv/squeezielive"
                    video_banner:"https://static-cdn.jtvnw.net/jtv_user_pictures/1e3c5fd7-de47-4a59-bc94-50baa1572123-channel_offline_image-1920x1080.png"
                    views: 11 554 222
                    community_id: ""
                    community_ids: Array(0)[]
                    created_at: "2019-03-12T18:55:38Z"
                    delay: 0
                    game: "Tom Clancy's The Division 2"
                    is_playlist: false
                    stream_type:"live"
                    video_height:1080
                    viewers:8653
                    * */

                    //console.log(dataUser)
                    if (dataUser.stream == null || dataUser.stream == undefined) {
                        //console.log(colors.green(`dataUser=NULL`))
                        return Delete_User_data_and_Streaming_Status(Streaming_User);
                    } else {
                        //console.log(colors.green(`dataUser!=NULL`))
                        //console.log(colors.green("il devrait stream normalement !"))
                        //console.log(colors.green(dataUser.stream.channel.name))

                        var guild_user = bot.bot.guilds.resolve(Streaming_User.ServerID);
                        if (!guild_user) {
                            //If the ServerID isn't findable
                            console.log(colors.green(`Can't find the ServerID of the user data`))
                            Delete_User_data_and_Streaming_Status(Streaming_User)
                            const User = bot.bot.users.resolve(Streaming_User.UserID)
                            if (User) {
                                User.createDM()
                                    .then(Util.SQL_DM_Invalid(Streaming_User.UserID, Streaming_User, "ServerID"))
                            }
                            return;
                        }

                        var channel_user = guild_user.channels.resolve(Streaming_User.ChannelID)
                        if (!channel_user) {
                            //If the ChannelID isn't findable
                            console.log(colors.green(`Can't find the ChannelID of the user data`))
                            Delete_User_data_and_Streaming_Status(Streaming_User)
                            const User = bot.bot.users.resolve(Streaming_User.UserID)
                            if (User) {
                                User.createDM()
                                    .then(Util.SQL_DM_Invalid(Streaming_User.UserID, Streaming_User, "ChannelID"))
                            }
                            return;
                        }


                        SelectAll_Queue(Streaming_User.UserTwitch, Streaming_User.ServerID, Streaming_User.ChannelID)
                            .then(result => {
                                if (!result) {
                                    //console.log(colors.green(`result`))
                                    console.log(result)
                                    //USED addUser(Streaming_User)
                                    Add_User_data_and_Streaming_Status(Streaming_User)
                                }
                            })

                        /*
                        if (!Streaming_User.MessageID) {
                            //Si le message de notif est PAS envoyé

                            console.log(colors.green(`MessageID=NULL`))
                            if (guild_user && channel_user) {
                                //We send the notification here
                                Util.SQL_Announce_Stream(Streaming_User, dataUser, false)
                            }

                        } else if (Streaming_User.MessageID != null) {
                            //Si le message de notif EST envoyé
                            console.log(colors.green(`MessageID=${Streaming_User.MessageID}`))
                            var message_user = channel_user.fetchMessage(Streaming_User.MessageID)
                                .then(async msg => {
                                    console.log(colors.green("Finded the msg"))
                                    //msg.edit("TEST DE OUF")
                                })
                                .catch(console.error);

                            if (guild_user && channel_user && message_user) {
                                //console.log(colors.green(message_user)

                            }


                        }
                        */

                    }
                })
                .catch(error => {
                    console.error(error);
                    console.error("Detected a rate limit of the API, reducing the call from now");
                    Util.restartTimer(Util.Verify_New_Streamers, 120, 120000, "interval");
                    console.log(colors.red("Rate Limit the function Verify_New_Streamers"))
                    //console.error(Streaming_User.UserTwitch)
                })
        }


        function Add_User_data_and_Streaming_Status(Streaming_User) {
            console.log(colors.green(`Adding the data of the user ${Streaming_User.UserID} - ${Streaming_User.UserTwitch}`))

            bot.con.query(`UPDATE ${Util.db_Model.users} SET IS_STREAMING = '1' WHERE UserTwitch = '${Streaming_User.UserTwitch}' AND ServerID = '${Streaming_User.ServerID}' AND ChannelID = '${Streaming_User.ChannelID}'`, (error) => {
                if (error) console.error(error)
            })

            addUser(Streaming_User)

            /*
            bot.con.query(`DELETE FROM ${Util.db_Model.queue} WHERE UserTwitch = '${Streaming_User.UserTwitch}'`, (error) => {
                if (error) console.error(error)
            })
            */

            /*
            if (Streaming_User.MessageID) {
                console.log(colors.green(`Deleting the announced message of the channelID`))

                var channel_user = bot.bot.channels.resolve(Streaming_User.ChannelID)
                if (channel_user) {
                    channel_user.fetchMessage(Streaming_User.MessageID)
                        .then(async msg => {
                            console.log(colors.green("Finded the msg"))
                            msg.delete()
                        })
                        .catch(console.error);
                }
            }
            */
        }

        function Delete_User_data_and_Streaming_Status(Streaming_User) {
            //console.log(colors.green(`Deleting the data of the user ${Streaming_User.UserID} - ${Streaming_User.UserTwitch}`))
            /*
            bot.con.query(`UPDATE ${Util.db_Model.users} SET IS_STREAMING = '${false}' WHERE UserID = '${Streaming_User.UserID}'`, (error) => {
                if (error) console.error(error)
            })
            */

            /*
            bot.con.query(`DELETE FROM ${Util.db_Model.queue} WHERE UserTwitch = '${Streaming_User.UserTwitch}'`, (error) => {
                if (error) console.error(error)
            })
            */

            /*
            if (Streaming_User.MessageID) {
                console.log(colors.green(`Deleting the announced message of the channelID`))

                var channel_user = bot.bot.channels.resolve(Streaming_User.ChannelID)
                if (channel_user) {
                    channel_user.fetchMessage(Streaming_User.MessageID)
                        .then(async msg => {
                            console.log(colors.green("Finded the msg"))
                            msg.delete()
                        })
                        .catch(console.error);
                }
            }
            */
        }
    }
}