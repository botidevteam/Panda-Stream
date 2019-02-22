module.exports = {
    help: {
        name: "purge"
    },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot").bot
            , Call = require("../bot").Call
            , Util = require("../Util")

        var message = call.message
            , user = call.message.member
            , author = call.message.author

        if (bot.BOT_MANAGE_MESSAGESPerm) {
            if (!call.args[0]) {
                message.reply(`Please, describe a number to purge`).then(function (msg) {
                    call.bot.deleteMyMessage(msg, 6000);
                })
                return;

            } else if (!parseInt(NumberToDelete)) {
                //console.log("pas un int")
                message.reply("This is not a number").then(msg => {
                    call.bot.deleteMyMessage(msg, 9 * 1000)
                })
                return;
            }

            if (!call.bot.BOT_MANAGE_MESSAGESPerm) {
                message.reply(call.bot.current_lang.Command_Bot_Need_Permission_Manage_Messages).then(function (msg) {
                    call.bot.deleteMyMessage(msg, 15 * 1000)
                });
                return;

            } else if (NumberToDelete <= 0) {
                message.reply(call.bot.current_lang.Command_Purge_Need_Number).then(function (msg) {
                    call.bot.deleteMyMessage(msg, 5000);
                })
                return;

            } else if (NumberToDelete > 100) {
                message.reply(call.bot.current_lang.Command_Purge_Max_100_Message_Delete).then(function (msg) {
                    call.bot.deleteMyMessage(msg, 6000);
                })
                return;

            } else if (!call.bot.member_has_MANAGE_MESSAGES) {
                message.reply(call.bot.current_lang.Command_User_Need_Permission_Manage_Messages).then(function (msg) {
                    call.bot.deleteMyMessage(msg, 7000);
                })
                return;
            }
            message.react(call.bot.EmojiGreenTick)
        } else {
            message.reply("I need the 'MANAGE_MESSAGES' permissions use that command.").then(msg => { Util.deleteMyMessage(msg, 8000) })
        }
    }
}