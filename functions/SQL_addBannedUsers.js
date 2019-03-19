module.exports = {
    /**
     * @param {INT} userID The userID to ban
     * @param {String} userTag The userTag of the banned user
     * @param {String} userBanReason The userBan reason
     * @param {INT} userBannerID The BannedID
     * @param returns The result of the request
     */
    //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)
    function(userID, userTag, userBanReason, userBannerID) {
        const bot = require("../bot").bot
            , Util = require("../Util")

        bot.con.query(`INSERT INTO ${Util.db_Model.bannedusers} (userID, userTag, userBanReason, userBannerID) VALUES (?, ?, ?, ?)`, [userID, userTag, userBanReason, userBannerID], (err, results) => {
            if (err) { console.error(err) }

            console.log(`Successfully added ${userToBan} in the banList`);
        });
    }
}