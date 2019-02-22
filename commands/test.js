module.exports = {
    help: { 
        name: "test",
        aliases: "test1"
     },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot").bot
            , Call = require("../bot").Call
            , Util = require("../Util")

        var message = call.message
            , user = call.message.member
            , author = call.message.author
        //RisedSky CTRL+` pls
        message.channel.send("tested field");
        var embed = new Discord.RichEmbed()
            .setTitle("test")
            .addField("test", "test")
            .setColor(0x00000);
        user.send(embed);
        //normal, don't worry, will fix that shit rn
        console.log(bot.user.username)

        //-----------------------------------
        Util.log_test("azeazzeazea")
        Util.NotifyUser("516033691525447680")

    }
}