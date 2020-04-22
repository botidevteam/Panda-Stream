module.exports = {
    /**
     * @param time The time in milliseconds
     * @param returns Will return the time to a better string
     */
    function(function_time) {
        const bot = require("../bot").bot
            , Util = require("../Util")


        var time = bot.moment.duration(function_time, "milliseconds");
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

        if (time.get("minutes") > 1) { time_var.m = "mins" }
        else if (time.get("minutes") == 1) { time_var.m = "min" }

        if (time.get("seconds") > 1) { time_var.s = "secs" }
        else if (time.get("seconds") == 1) { time_var.s = "sec" }


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
        return time_string
    }
}
