module.exports = {
    /**
     * @param {INT} userID The userID of the banned user
     * @param returns The result of the request
     */
    //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)
    function(userID) {
        const bot = require("../bot").bot
            , Util = require("../Util")
        bot.con.query(`DELETE FROM ${Util.db_Model.bannedusers} WHERE userID = ${userID}`, (err, results) => {
            if (err) console.log(err);

            console.log(`Successfully removed ${userID} in the banList`);
        });
    }
}

