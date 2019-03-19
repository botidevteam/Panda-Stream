module.exports = {
    help: { 
        name: "test",
        aliases: "test1"
     },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot").bot
            , Util = require("../Util")

        var message = call.message
            , user = call.message.member
        message.channel.send("tested field");
        var embed = new Discord.RichEmbed()
            .setTitle("test")
            .addField("test", "test")
            .setColor(0x00000);
        user.send(embed);
        console.log(bot.user.username)

        //-----------------------------------
        Util.log_test("azeazzeazea")
        Util.NotifyUser("516033691525447680")
    }
}