module.exports = {
    /**
     * @param {String} model Define the model where to track the data
     * @param {String} get_where Get the data (get_where)
     * @param message The user message
     * @param member The member object
     */
    function(model, get_where, message, member) {
        return new Promise((resolve, reject) => {
            bot.con.query(`SELECT * FROM ${model} WHERE ${get_where} = '${message.guild.id}'`, (err, results) => {
                if (!err) {
                    if (results == null) {
                        bot.SQL_Insert_NewServer(member);
                        resolve();
                    } else resolve(results[0]);
                } else reject(err);
            });
        });
    }
}