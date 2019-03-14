module.exports = {
    help: {
        name: "purge"
    },
    run: async (call) => {
        const Discord = require("discord.js")
            , bot = require("../bot").bot
            , Util = require("../Util")

        var message = call.message
            , member = call.message.member
            , author = call.message.author
            , queue_String = []
            , delete_msg

        if (!call.args[0]) return message.reply(`Please, describe a number to purge`)
            .then(msg => { Util.deleteMyMessage(msg, 6 * 1000) })

        let NumberToDelete = call.args[0]

        if (!parseInt(NumberToDelete)) return message.reply("This is not a number")
            .then(msg => { Util.deleteMyMessage(msg, 9 * 1000) })

        if (!call.bot.BOT_MANAGE_MESSAGESPerm) return message.reply("I need the permission 'MANAGE_MESSAGES' to do that")
            .then(msg => { return Util.deleteMyMessage(msg, 15 * 1000) })

        if (!call.bot.member_has_MANAGE_MESSAGES) return message.reply("You need the 'MANAGE_MESSAGES' permissions use that command")
            .then(msg => { Util.deleteMyMessage(msg, 8 * 1000) })

        if (NumberToDelete <= 0) return message.reply("This can't be a number egal or less than 0")
            .then(msg => { Util.deleteMyMessage(msg, 5 * 1000) })
        else if (NumberToDelete >= 100) NumberToDelete = 100

        await message.react(Util.EmojiGreenTickString)
        await message.delete(2000)

        setTimeout(async () => {
            message.channel.fetchMessages({ limit: NumberToDelete })
                .then(async messages => {
                    messages.forEach(msg => {
                        queue_String.push(msg)
                    });
                    message.channel.send(`${Util.EmojiGreenTickString} Deleting ${NumberToDelete} messages`).then(msg => delete_msg = msg)
                    //console.log(queue_String)

                    setTimeout(async () => {
                        queueMsg()
                    }, 2500);
                })
                .catch(err => {
                    console.log(err)
                    message.channel.send(Util.errorMessage(err, "purge"))
                })
        }, 2250);

        async function queueMsg() {
            //console.log(queue_String.length)
            while (queue_String.length != 0) {
                var msg = queue_String.shift()
                if (!msg.pinned && msg.deletable) await msg.delete()
                    .then(async () => await delete_msg.edit(`${Util.EmojiGreenTickString} Deleted ${NumberToDelete - queue_String.length} messages`))
            }
            await delete_msg.edit(`${Util.EmojiGreenTickString} Deleted all the requested messages!\n\nRequested by ${Util.NotifyUser(message.author.id)}`)
        }
    }
}