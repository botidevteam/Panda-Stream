module.exports = {
    /**
     * @param {String} model Define the model where to track the data
     * @param ServerID The user message
     * @param returns The result of the request
     */
    function(model, ServerID) {
        const bot = require("../bot")
            , Util = require("../Util")

        //console.log(`SELECT * FROM ${model} WHERE ${get_where} = '${message.guild.id}'`)
        return new Promise((resolve, reject) => {
            bot.con.query(`SELECT * FROM ${model} WHERE ServerID = '${ServerID}'`, (err, results) => {
                if (!err) {
                    if (results == null || results == undefined || results == "") {
                        //Util.SQL_AddServer(member);
                        resolve();
                    } else resolve(results[0]);
                } else reject(err);
            });
        });
    }
}