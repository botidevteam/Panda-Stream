module.exports = {
    /**
     * @param userID The member ID
     * @param UserTwitch The Twitch User
     * @param ServerID The server ID
     * @param ChannelID The channel of the stream announce
     * @param {Boolean} Remove_MSG_On_End When true, the announce will be deleted if the user stopped his stream
     * @param returns Will add the user to the users table, witch will be looked every X timer
     */
    function(userID, UserTwitch, ServerID, ChannelID, Remove_MSG_On_End) {
        const bot = require("../bot").bot
            , Util = require("../Util")

        if (!userID || !UserTwitch || !ServerID || !ChannelID) {
            return console.log("You didn't defined any requested field")
        }

        bot.con.query(`INSERT INTO ${Util.db_Model.users} (userID, UserTwitch, ServerID, ChannelID, Remove_MSG_On_End) VALUES (?, ?, ?, ?, ?)`, [userID, UserTwitch, ServerID, ChannelID, Remove_MSG_On_End], (err, results) => {
            if (err) { return console.log(err); }

            console.log(`Successfully added a new user in the DB`)
        });
    }
}