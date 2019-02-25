module.exports = {
    /**
     * @param {INT} userID The userID of the user
     * @param returns The result of the request
     */
    //Util.SQL_addBannedUsers(userToBan, userBanReason, message.member.ID)
    function(userID) {
        const bot = require("../bot").bot
            , Util = require("../Util")
        return new Promise((resolve, reject) => {
            bot.con.query(`SELECT * FROM ${Util.db_Model.bannedusers}`, (err, results) => {
                if (!err) {
                    resolve(results[0]);
                } else reject(err);
            });
        });
    }
}