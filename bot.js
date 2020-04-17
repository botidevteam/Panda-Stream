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
//,  dbl = new DBL('Your discordbots.org token', client);
//#endregion
//#region Variable

//BOT VARIABLE
const Util = require("./Util")
const i18n = require("./i18n")
let ServerLang = ""

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
            `Connected as ${bot.user.tag}\n` +
            "---------------------------------"))
    //--------------------------
    bot.user.setStatus("online")
    bot.user.setActivity(`${config.prefix}help | Started and ready!`, { type: "STREAMING", url: "https://twitch.tv/RisedSky_FR" })

    for (var i in bot.guilds.array) {
        console.log(colors.cyan(`Server number ${i} » '${bot.guilds.array[i]}'`))
    }

    Util.SQL_Instance_Erase(); //Delete all the data from the instance table

    setInterval(async () => {
        Util.Verify_New_Streamers();
    }, 30 * 1000); //30 sec

    setInterval(async () => {
        Util.Verify_Stream_Table();
    }, 60 * 1000); //60 sec

    /*
    Deprecated, Deleting in version 2.0
    setInterval(async () => {
        Util.SQL_Update_Stream()
    }, 300000);
    */


    //Util.startupsite()
    console.log(colors.blue("The bot is now ready !"))
    setTimeout(ChangeState1, 60000);
    //Util.startupsite()
})

//#region DBL API 

//#endregion

bot.on("guildCreate", async guild => {
    con.query(`SELECT * FROM ${Util.db_Model.servers} WHERE ServerID = '${guild.id}'`, (error, res) => {
        if (error || res == null) {
            con.query(`INSERT INTO ${Util.db_Model.servers} (ServerName, ServerID, ServerOwnerID, ServerPrefix, ServerLang) VALUES (?, ?, ?, ?, ?)`, [guild.name, guild.id, guild.ownerID, config.prefix, "english"], (err, results) => {
                if (err) console.log(err);
                console.log(colors.green("Inserted the new server !"));
            });
        }
    })

})

bot.on("guildUpdate", async (oldguild, newguild) => {
    con.query(`SELECT * FROM ${Util.db_Model.servers} WHERE ServerID = '${newguild.id}'`, (error, res) => {
        if (error) { console.error(error) }

        //console.log(newguild.name)
        //console.log(res[0].ServerName)
        if (res[0].ServerName != newguild.name) {
            //console.log("Not the same")
            con.query(`UPDATE ${Util.db_Model.servers} SET ServerName = '${newguild.name}' WHERE ServerID = '${newguild.id}'`, (err, results) => {
                if (err) { console.error(err) }
            })
            console.log(colors.green(`Updated the server '${newguild.name}' because of the ServerName change`));
        }
    })
})

bot.on("message", async message => {
    if (!message.guild) return;
    if (message.author.bot) return;
    //#region Bot Permissions
    bot.BOT_SEND_MESSAGESPerm = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.guild.me).has("SEND_MESSAGES") && message.channel.type === 'text'
    bot.BOT_MANAGE_MESSAGESPerm = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.guild.me).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.BOT_ADMINISTRATORPerm = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.guild.me).has("ADMINISTRATOR") && message.channel.type === 'text'
    bot.BOT_USE_EXTERNAL_EMOJISPerm = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") && message.channel.type === 'text'
    bot.BOT_ADD_REACTIONSPerm = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.guild.me).has("ADD_REACTIONS") && message.channel.type === 'text'
    //#endregion

    //#region User Permissions
    bot.member_Has_ADMINISTRATOR = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("ADMINISTRATOR") && message.channel.type === 'text'
    bot.member_Has_BAN_MEMBERS = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("BAN_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_KICK_MEMBERS = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("KICK_MEMBERS") && message.channel.type === 'text'
    bot.member_Has_MANAGE_GUILD = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("MANAGE_GUILD") && message.channel.type === 'text'
    bot.member_Has_MANAGE_MESSAGES = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("MANAGE_MESSAGES") && message.channel.type === 'text'
    bot.member_Has_MANAGE_CHANNELS = await message.guild.channels.resolve(message.channel.id).permissionsFor(message.member).has("MANAGE_CHANNELS") && message.channel.type === 'text'
    //#endregion

    Util.SQL_GetResult(Util.db_Model.servers, "ServerID", message, message.member).then(async results => {
        if (results == null || results == undefined || results == "") return
        /**
         * @param results.ServerID The server ID
         * @param results.ServerLang The server lang
         * @param results.ServerName The server name
         * @param results.ServerOwnerID The server owner ID
         * @param results.ServerPrefix The server prefix
         */

        ServerLang = results.ServerLang

        const server_prefix = await results.ServerPrefix
            //, cmd = await message.content.slice(config.prefix.length).trim().split(/ +/g).shift()
            //, args = await message.content.slice(config.prefix.length).trim().split(/ +/g).join(" ").slice(cmd.length + 1).split(" ")
            , server_cmd = await message.content.slice(results.ServerPrefix.length).trim().split(/ +/g).shift()
            , server_args = await message.content.slice(results.ServerPrefix.length).trim().split(/ +/g).join(" ").slice(server_cmd.length + 1).split(" ")
            //, cmd = message.content.slice(config.prefix.length).trim().split(/ +/g)
            , server_content = await server_args.join(" ");

        const default_prefix = await config.prefix
            , default_cmd = message.content.slice(default_prefix.length).trim().split(/ +/g).shift()
            , default_args = await message.content.slice(default_prefix.length).trim().split(/ +/g).join(" ").slice(default_cmd.length + 1).split(" ")
            , default_content = await default_args.join(" ");


        if (message.channel.topic && String(message.channel.topic).includes(":ideas:")) {
            message.react(Util.EmojiGreenTickString)
            message.react(Util.EmojiRedTickString)
        }

        if (message.content.startsWith(server_prefix) && !message.author.bot) {
            if (message.channel.topic)
                if (String(message.channel.topic).toLowerCase().includes(":nocmds:")) {
                    if (!bot.member_Has_ADMINISTRATOR) {
                        message.author.send(`The channnel ${Util.NotifyChannel(message.channel.id)} have a \`:nocmds:\` tag and you not allowed to send any commands in this channel.`);
                        return message.delete(1250);
                    }
                }

            Util.SQL_getBanInfo(message.author.id).then(results => {
                if (!results) {
                    console.log("Not banned")
                } else {
                    return console.log(results)
                }
            })
            //if (Util.SQL_getBanInfo(message.author.id).includes(message.author.id)) return console.log(colors.green(`'${message.author.tag}' is a banned user`);

            const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(server_cmd));
            if (commandFile != null) {
                if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
                    commandFile.run(new Call(message, bot, bot.commands, server_args, server_content, server_prefix, server_cmd));
                } else message.reply(i18n.function(results.ServerLang).Command_Not_Working_In_DM).catch(() => { });
            }

            //IF THE COMMAND IS FROM THE DEFAULT PREFIX THEN
        } else if (message.content.startsWith(default_prefix) && !message.author.bot) {
            console.log(colors.green(`Detected the prefix ${default_prefix}`))
            if (message.channel.topic) {
                if (String(message.channel.topic).toLowerCase().includes(":nocmds:")) {
                    if (!bot.member_Has_ADMINISTRATOR) {
                        message.author.send(`The channnel ${Util.NotifyChannel(message.channel.id)} has a \`:nocmds:\` tag and you not allowed to send any commands in this channel.`);
                        return message.delete(1250);
                    }
                }
            }


            Util.SQL_getBanInfo(message.author.id).then(results => {
                if (!results) { console.log("Not banned") }
                else { return console.log(results) }
            })
            //if (Util.SQL_getBanInfo(message.author.id).includes(message.author.id)) return console.log(colors.green(`'${message.author.tag}' is a banned user`);

            const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(default_cmd));
            if (commandFile != null) {
                if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
                    commandFile.run(new Call(message, bot, bot.commands, default_args, default_content, default_prefix, default_cmd));
                } else {
                    message.reply(i18n.function(results.ServerLang).Command_Not_Working_In_DM).catch(() => { });
                }
            }
        }
    })
})

//#region All functions
async function StreamInterval() {
    //Working
    //Util.Verify_Stream_Table()

    //Util.Verify_New_Streamers()

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

            //console.log(colors.green(m.presence)
            if (!m.presence) return;
            if (!m.presence.status) return;

            if (m.presence.status == "streaming") {
                console.log(colors.yellow(`${m.member.user.tag} is streaming`))
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
    var time_string = Util.time_Into_String(bot.uptime)

    //console.log(colors.green(time_string)
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
    if (jsfiles.length <= 0) return console.log(colors.red("Couldn't find commands."));
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
            console.log(colors.red(`\nThe ${f} command failed to load:`))
            console.log(colors.red(err))
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

module.exports = { bot, Call, con, twitch, i18n, ServerLang }