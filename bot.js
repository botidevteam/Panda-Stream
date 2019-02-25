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

bot.config = config
bot.moment = moment


//#endregion
//#region Data Connection
bot.login(bot.config.token)

bot.con = mysql.createPool({
    host: bot.config.MySQL_host,
    user: bot.config.MySQL_user,
    database: bot.config.MySQL_database,
    password: bot.config.MySQL_password
});
//#endregion

bot.once("ready", () => {
    console.log(colors.green("---------------------------------\n" + bot.config.prefixLog + " Bot created by BotiDevTeam\n" + bot.config.prefixLog + " All rights are Reserved\n" + bot.config.prefixLog + " The bot is ready\n---------------------------------"))
    //--------------------------
    bot.user.setStatus("online")
    bot.user.setActivity(`${bot.config.prefix}help | Started and ready !`)

    for (var i in bot.guilds.array()) {
        console.log(`Server number ${i} » '${bot.guilds.array()[i]}'`)
    }

    console.log(colors.blue("The bot is now ready !"))
    setTimeout(ChangeState1, 60000);
})

//#region DBL API 

//#endregion

bot.on("guildCreate", async guild => {
    bot.con.query(`INSERT INTO ${bot.DB_Model} (ServerName, ServerID, ServerPrefix, ServerLang) VALUES (?, ?, ?, ?, ?)`, [guild.name, guild.id, config.prefix, "english"], (err, results) => {
        if (err) console.log(err);
        console.log("Inserted the new server !");
    });
})


bot.on("message", async message => {
    if (message.author.bot) return;
    console.log(Util.SQL_getBanInfo)
    //if (Util.SQL_getBanInfo.includes(message.author.ID)) return console.log(`'${message.author.tag}' is a banned user`);

    //#region Bot Permissions
    bot.BOT_SEND_MESSAGESPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("SEND_MESSAGES") && message.channel.type === 'text'
    bot.BOT_MANAGE_MESSAGESPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.BOT_ADMINISTRATORPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("ADMINISTRATOR") && message.channel.type === 'text'
    bot.BOT_USE_EXTERNAL_EMOJISPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") && message.channel.type === 'text'
    bot.BOT_ADD_REACTIONSPerm = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.guild.me).has("ADD_REACTIONS") && message.channel.type === 'text'
    //#endregion

    //#region User Permissions
    bot.member_Has_BAN_MEMBERS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("BAN_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_KICK_MEMBERS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("KICK_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_MANAGE_GUILD = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_GUILD") && message.channel.type === 'text'
    bot.member_has_MANAGE_MESSAGES = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.member_has_MANAGE_CHANNELS = await message.guild.channels.find(c => c.id === message.channel.id).permissionsFor(message.member).has("MANAGE_CHANNELS") && message.channel.type === 'text'
    //#endregion

    const prefix = await bot.config.prefix,
        cmd = await message.content.slice(bot.config.prefix.length).trim().split(/ +/g).shift(),
        args = await message.content.slice(bot.config.prefix.length).trim().split(/ +/g).join(" ").slice(cmd.length + 1).split(" "),
        //cmd = message.content.slice(bot.config.prefix.length).trim().split(/ +/g),
        content = await args.join(" ");

    if (message.content.startsWith(prefix) && !message.author.bot) {
        const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(cmd));
        if (commandFile != null) {
            if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
                commandFile.run(new Call(message, bot, bot.commands, args, content, prefix, cmd));
            } else message.reply("This command is not working in DM.").catch(() => { });
        }
    }
})

//#region All functions
bot.StreamInterval = async function () {
    for (var i_g in bot.guilds.array()) {
        let guild = bot.guilds.array()[i_g]

        for (var i_m in guild.members.array()) {
            m = guild.members.array()[i_m]

            console.log(m.presence)
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
    bot.user.setActivity(`${bot.config.prefix}help | Developed by BotiDevTeam`)
    //Vous avez besoin d'aide?
    setTimeout(async () => { ChangeState2() }, 60000);
}

function ChangeState2() {
    var time = bot.moment.duration(bot.uptime, "milliseconds");
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

    console.log(time_string)
    bot.user.setActivity(`${bot.config.prefix}help | Launched since ${time_string}`)

    setTimeout(async () => { ChangeState1() }, 60000);
}

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

module.exports = { bot, Call }