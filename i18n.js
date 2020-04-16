module.exports = {
    english: require("./i18n/english"),
    french: require("./i18n/french"),

    function(ServerLang) {
        if (!ServerLang) console.log("There is no ServerLang")
        else {
            if (ServerLang == "english")
                return this.english

            else if (ServerLang == "french")
                return this.french
        }
    },
}