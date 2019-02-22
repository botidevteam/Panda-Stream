module.exports = {
    registeruser: {
        name: "register"
    },
    run: async (call) => {
        const discord = require('discord.js')
            , Util = require("../Util")
            , config = require('../config.js')
            , bot = require("../bot.js").bot
            , Call = require('../bot.js').Call

        var message = call.message
            , user = call.message.member
            , author = call.message.author

            
}
}