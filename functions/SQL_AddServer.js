module.exports = {
    /**
     * @param {*} member The member object (message.member)
     */
    function(member) {
        const bot = require("../bot").bot
            , Util = require("../Util")

        bot.con.query(`INSERT INTO ${Util.db_Model.servers} (ServerName, ServerID, ServerOwnerID) VALUES (?, ?, ?)`, [member.guild.name, member.guild.id, member.guild.ownerID], (err, results) => {
            if (err) return console.log(err)

            console.log(`Successfully added a new server in the DB`)
        });
    }
}