//#region Require package
const Discord = require("discord.js")
    , bot = new Discord.Client({ autoReconnect: true })
    , TwitchPKG = require("twitch.tv-api")
    , colors = require("colors")
    , mysql = require("mysql2/promise")
    , config = require("./config.js")
    , fs = require("fs")
    , DBL = require('dblapi.js')
    , moment = require("moment")
//, Twitch = TwitchPKG()
//,  dbl = new DBL('Your discordbots.org token', client);
//#endregion
//#region Variable

//BOT VARIABLE
const Util = require("./Util")

const twitch = new TwitchPKG({
    id: config.twitch_id,
    secret: config.twitch_secret
})

bot.config = config
bot.moment = moment


//#endregion

//#region Data Connection
bot.login(config.token)

const con = mysql.createPool({
    host: config.MySQL_host,
    user: config.MySQL_user,
    database: config.MySQL_database,
    password: config.MySQL_password
});
bot.con = con;
//#endregion

bot.once("ready", () => {
    console.log(
        colors.green("---------------------------------\n" +
            `${config.prefixLog} Bot created by BotiDevTeam\n` +
            `${config.prefixLog} All rights are Reserved\n` +
            `${config.prefixLog} The bot is ready\n` +
            "---------------------------------"))
    //--------------------------
    bot.user.setStatus("online")
    bot.user.setActivity(`${config.prefix}help | Started and ready!`, { type: "STREAMING", url: "https://twitch.tv/RisedSky_FR" })

    for (var i in bot.guilds.array()) {
        console.log(`Server number ${i} » '${bot.guilds.array()[i]}'`)
    }

    Util.SQL_Instance_Erase() //Delete all the data from the instance table

    setInterval(async () => {
        StreamInterval()
    }, 5000);

    console.log(colors.blue("The bot is now ready !"))
    setTimeout(ChangeState1, 60000);
    //Util.startupsite()
})

//#region DBL API 

//#endregion

bot.on("guildCreate", async guild => {
    bot.con.query(`SELECT * FROM ${Util.db_Model.servers} WHERE ServerID = '${guild.id}`, (error, res) => {
        if (error) bot.con.query(`INSERT INTO ${Util.db_Model.servers} (ServerName, ServerID, ServerPrefix, ServerLang) VALUES (?, ?, ?, ?)`, [guild.name, guild.id, config.prefix, "english"], (err, results) => {
            if (err) console.log(err);
            console.log("Inserted the new server !");
        });
    })

})

bot.on("message", async message => {
    if (message.author.bot) return;
    console.log(Util.SQL_getBanInfo(message.author.id))
    //if (Util.SQL_getBanInfo(message.author.id).includes(message.author.id)) return console.log(`'${message.author.tag}' is a banned user`);

    //#region Bot Permissions
    bot.BOT_SEND_MESSAGESPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("SEND_MESSAGES") && message.channel.type === 'text'
    bot.BOT_MANAGE_MESSAGESPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.BOT_ADMINISTRATORPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("ADMINISTRATOR") && message.channel.type === 'text'
    bot.BOT_USE_EXTERNAL_EMOJISPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") && message.channel.type === 'text'
    bot.BOT_ADD_REACTIONSPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("ADD_REACTIONS") && message.channel.type === 'text'
    //#endregion

    //#region User Permissions
    bot.member_Has_ADMINISTRATOR = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("ADMINISTRATOR") && message.channel.type === 'text'
    bot.member_Has_BAN_MEMBERS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("BAN_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_KICK_MEMBERS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("KICK_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_MANAGE_GUILD = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_GUILD") && message.channel.type === 'text'
    bot.member_has_MANAGE_MESSAGES = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.member_has_MANAGE_CHANNELS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_CHANNELS") && message.channel.type === 'text'
    //#endregion

    Util.SQL_GetResult(Util.db_Model.servers, "ServerID", message, message.member).then(async results => {
        if (results == null || results == undefined || results == "") return
        /**
         * @param results.ServerID The server ID
         * @param results.ServerLang The server lag
         * @param results.ServerName The server name
         * @param results.ServerOwnerID The server owner ID
         * @param results.ServerPrefix The server prefix
         */

        //const prefix = await config.prefix
        const prefix = await results.ServerPrefix
            //, cmd = await message.content.slice(config.prefix.length).trim().split(/ +/g).shift()
            //, args = await message.content.slice(config.prefix.length).trim().split(/ +/g).join(" ").slice(cmd.length + 1).split(" ")
            , cmd = await message.content.slice(results.ServerPrefix.length).trim().split(/ +/g).shift()
            , args = await message.content.slice(results.ServerPrefix.length).trim().split(/ +/g).join(" ").slice(cmd.length + 1).split(" ")
            //, cmd = message.content.slice(config.prefix.length).trim().split(/ +/g)
            , content = await args.join(" ");

        if (message.channel.topic && String(message.channel.topic).includes(":ideas:")) {
            message.react(Util.EmojiGreenTickString)
            message.react(Util.EmojiRedTickString)
        }

        if (message.content.startsWith(prefix) && !message.author.bot) {
            if (message.channel.topic)
                if (String(message.channel.topic).toLowerCase().includes(":nocmds:")) {
                    if (!bot.member_Has_ADMINISTRATOR) {
                        message.author.send(`The channnel ${Util.NotifyChannel(message.channel.id)} have a \`:nocmds:\` tag and you not allowed to send any commands in this channel.`);
                        return message.delete(1250);
                    }
                }

            const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(cmd));
            if (commandFile != null) {
                if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
                    commandFile.run(new Call(message, bot, bot.commands, args, content, prefix, cmd));
                } else message.reply("This command is not working in DM.").catch(() => { });
            }

            //IF THE COMMAND IS FROM THE DEFAULT PREFIX THEN
        } else if (message.content.startsWith(config.prefix) && !message.author.bot) {
            if (message.channel.topic)
                if (String(message.channel.topic).toLowerCase().includes(":nocmds:")) {
                    if (!bot.member_Has_ADMINISTRATOR) {
                        message.author.send(`The channnel ${Util.NotifyChannel(message.channel.id)} has a \`:nocmds:\` tag and you not allowed to send any commands in this channel.`);
                        return message.delete(1250);
                    }
                }
            const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(cmd));
            if (commandFile != null) {
                if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
                    commandFile.run(new Call(message, bot, bot.commands, args, content, config.prefix, cmd));
                } else message.reply("This command is not working in DM.").catch(() => { });
            }
        }
    })
})

//#region All functions
async function StreamInterval() {
    Util.Verify_Stream_Table()
    /*
    Util.SQL_Instance_AddAnnouced()
    Util.SQL_Instance_AddDeleted()
    Util.SQL_Instance_AddGood()
    Util.SQL_Instance_AddError()
    */
    for (var i_g in bot.guilds.array()) {
        let guild = bot.guilds.array()[i_g]

        for (var i_m in guild.members.array()) {
            m = guild.members.array()[i_m]

            //console.log(m.presence)
            if (!m.presence) return;
            if (!m.presence.status) return;

            if (m.presence.status == "streaming") {
                console.log(`${m.member.user.tag} is streaming`)
                //do something with that
            }
        }
    }
}

//#region State change
function ChangeState1() {
    bot.user.setActivity(`${config.prefix}help | Developed by BotiDevTeam`, { type: "STREAMING", url: "https://twitch.tv/RisedSky_FR" })
    setTimeout(async () => { ChangeState2() }, 60000);
}

function ChangeState2() {
    var time = moment.duration(bot.uptime, "milliseconds");
    var time_string;
    let time_var = {
        d: "",
        h: "",
        m: "",
        s: ""
    }

    if (time.get("days") > 1) { time_var.d = "days" }
    else if (time.get("days") == 1) { time_var.d = "day" }

    if (time.get("hours") > 1) { time_var.h = "hours" }
    else if (time.get("hours") == 1) { time_var.h = "hour" }

    if (time.get("minutes") > 1) { time_var.m = "minutes" }
    else if (time.get("minutes") == 1) { time_var.m = "minute" }

    if (time.get("seconds") > 1) { time_var.s = "seconds" }
    else if (time.get("seconds") == 1) { time_var.s = "second" }


    if (time.get("days") >= 1) {
        time_string = `${time.get("days")} ${time_var.d}`
        if (time_var.h) { time_string += `, ${time.get("hours")} ${time_var.h}` }
        if (time_var.m) { time_string += `, ${time.get("minutes")} ${time_var.m}` }
        if (time_var.s) { time_string += `, ${time.get("s")} ${time_var.s}.` }

    } else if (time.get("hours") >= 1) {
        time_string = `${time.get("hours")} ${time_var.h}`
        if (time_var.m) { time_string += `, ${time.get("minutes")} ${time_var.m}` }
        if (time_var.s) { time_string += `, ${time.get("s")} ${time_var.s}.` }

    } else if (time.get("minutes") >= 1) {
        time_string = `${time.get("minutes")} ${time_var.m}`
        if (time_var.s) { time_string += `, ${time.get("s")} ${time_var.s}.` }

    } else if (time.get("seconds") >= 1) {
        time_string = `${time.get("seconds")} ${time_var.s}.`
    }

    //console.log(time_string)
    bot.user.setActivity(`${config.prefix}help | Launched since ${time_string}`, { type: "STREAMING", url: "https://twitch.tv/RisedSky_FR" })

    setTimeout(async () => { ChangeState1() }, 60000);
}

//#endregion


//#endregion
//#region Command Handler
bot.commands = new Discord.Collection();
bot.disabledCommands = [];
var jsfiles;

function checkCommand(command, name) {
    var resultOfCheck = [true, null];
    if (!command.run) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Function: "module.run" of ${name}.`;
    if (!command.help) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Object: "module.help" of ${name}.`;
    if (command.help && !command.help.name) resultOfCheck[0] = false; resultOfCheck[1] = `Missing String: "module.help.name" of ${name}.`;
    return resultOfCheck;
}

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);
    jsfiles = files.filter(f => f.endsWith(".js"));
    if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
    jsfiles.forEach((f) => {
        try {
            var props = require(`./commands/${f}`);
            if (checkCommand(props, f)[0]) {
                bot.commands.set(props.help.name, props);
            } else {
                throw checkCommand(props, f)[1];
            }
        } catch (err) {
            bot.disabledCommands.push(f);
            console.log(`\nThe ${f} command failed to load:`);
            console.log(err);
        }
    });
});

class Call {
    constructor(message, bot, commands, args, content, prefix, cmd) {
        this.message = message;
        this.bot = bot;
        this.commands = commands;
        this.args = args;
        this.content = content;
        this.prefix = prefix;
        this.cmd = cmd;
    }
}
//#endregion
//#endregion

module.exports = { bot, Call, con, twitch }