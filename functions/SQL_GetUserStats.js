module.exports = {
    /**
     * @param userID The member ID
     * @param returns The result of the request
     * @param returns Will return the user you are requesting
     */
    function(userID) {
        const bot = require("../bot").bot
            , Util = require("../Util")

        return new Promise((resolve, reject) => {
            bot.con.query(`SELECT * FROM ${Util.db_Model.users} WHERE UserID = '${userID}'`, (err, results) => {
                if (!err) {
                    if (results == null) {
                        //Util.SQL_addNewUser_In_DB_Users(member);
                        resolve();
                    } else resolve(results[0]);
                } else reject(err);
            });
        });
    }
}

