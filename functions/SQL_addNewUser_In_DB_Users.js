module.exports = {
    /**
     * @param userID The member ID
     * @param UserTwitch The Twitch User
     * @param ServerID The server ID
     * @param ChannelID The channel of the stream announce
     * @param Stream_Text The requested text to send when a user is live
     * @param {Boolean} Remove_MSG_On_End When true, the announce will be deleted if the user stopped his stream
     * @param returns Will add the user to the users table, witch will be looked every X timer
     */
    function(userID, UserTwitch, ServerID, ChannelID, Stream_Text, Remove_MSG_On_End) {
        const bot = require("../bot").bot
            , Util = require("../Util")

        if (!userID || !UserTwitch || !ServerID || !ChannelID || !Stream_Text || !Remove_MSG_On_End) {
            return "You didn't defined any requested field"
        }
        return new Promise((resolve, reject) => {
            bot.con.query(`INSERT INTO ${Util.db_Model.users} (userID, UserTwitch, ServerID, ChannelID, Stream_Text, Remove_MSG_On_End) VALUES (?, ?, ?, ?, ?, ?)`, [], (err, results) => {
                if (!err) {
                    if (results == null) {
                        Util.SQL_addNewUser_In_DB_Users(member);
                        resolve();
                    } else resolve(results[0]);
                } else reject(err);
            });
        });
    }
}