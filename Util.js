module.exports = {
    //Define the functions so we can use it everywhere
    //#region SQL Functions

    db_Model: {
        queue: "Queue",
        users: "Users",
        servers: "Servers",
        stats: "Stats"
    },
    SQL_GetResult: require("./functions/SQL_GetResult").function,
    log_test: require("./functions/log_test").function,
    getStatus: require("./commands/getStatus").function,

    //#endregion
    sendDMToUser: require("./functions/SQL_GetResult"),
    NotifyUser: require("./functions/log_test").function,
    deleteMyMessage: require("./functions/SQL_GetResult"),
    CheckInfo_ToBooleanEmoji: require("./functions/SQL_GetResult")

}