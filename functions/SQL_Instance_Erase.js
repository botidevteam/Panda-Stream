module.exports = {
    function() {
        const bot = require("../bot")
            , Util = require("../Util")

        /*
        bot.con.query(`DELETE FROM ${Util.db_Model.instancestats}`, (err, results) => {
            if (err) console.log(err);

            console.log(`Successfully removed everything in the ${Util.db_Model.instancestats}`);
        });
        */
        bot.con.query(`SELECT * FROM ${Util.db_Model.instancestats}`, (err, results) => {
            /**
              * @param results.StreamMSG_Announced
              * @param results.StreamMSG_Deleted
              * @param results.StatsErrors
              * @param results.StatsGood
              */
            if (err) return console.log(err);
            bot.con.query(`UPDATE ${Util.db_Model.instancestats} SET StreamMSG_Announced = 0 WHERE ID = 1`)
            bot.con.query(`UPDATE ${Util.db_Model.instancestats} SET StreamMSG_Deleted = 0 WHERE ID = 1`)
            bot.con.query(`UPDATE ${Util.db_Model.instancestats} SET StatsErrors = 0 WHERE ID = 1`)
            bot.con.query(`UPDATE ${Util.db_Model.instancestats} SET StatsGood = 0 WHERE ID = 1`)
            console.log(`Successfully removed everything in the ${Util.db_Model.instancestats}`);
        });
    }
}