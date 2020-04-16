module.exports = {
    help: { name: "eval" },
    run: async (call) => {
        const message = call.message
        , channel = message.channel
        , guild = message.guild;


        const Discord = require("discord.js")
            , bot = require("../bot")
            , Util = require("../Util")
        //message, bot, bot.commands, args, content, prefix, cmd

        //await message.delete()
        let owner_list = Util.Staff_List;
        if (!owner_list.includes(message.author.id)) return;

        function clean(text) {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }

        try {
            const code = call.content;
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.channel.send(clean(evaled), { code: "xl", split: true });
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

    }
}