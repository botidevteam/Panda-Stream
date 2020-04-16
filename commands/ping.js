module.exports = {
    help: {
        name: "ping"
    },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot")
            , Util = require("../Util")

        const message = call.message;

        await message.react(Util.EmojiGreenTickString);

        let embed = new Discord.MessageEmbed()
            .setAuthor(bot.bot.user.username, bot.bot.user.avatarURL)
            .setDescription("")
            .setColor("GREEN")
            .setFooter(`Command requested by ${message.member.user.username}`)
            .setTimestamp();

        const msg_embed = await message.channel.send(embed);
        console.log(Math.round((msg_embed.createdTimestamp - message.createdTimestamp)));
        //console.log(bot.bot.ping);
        //embed.setDescription(`\n:ping_pong: ${Math.round(msg_embed.createdTimestamp - message.createdTimestamp) - bot.bot.ping} ms`);
        embed.setDescription(`\n:ping_pong: ${Math.round((msg_embed.createdTimestamp - message.createdTimestamp))} ms`);
        await msg_embed.edit(embed);
        //message.delete(5000)
        message.delete({ timeout: 5000 });


        //msg_embed.delete(6000)
    }

}