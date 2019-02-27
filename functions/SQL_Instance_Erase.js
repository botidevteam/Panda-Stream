module.exports = {
    function() {
        const bot = require("../bot").bot
            , Util = require("../Util")

        bot.con.query(`DELETE FROM ${Util.db_Model.instancestats}`, (err, results) => {
            if (err) console.log(err);

            console.log(`Successfully removed everything in the ${Util.db_Model.instancestats}`);
        });
    }
}