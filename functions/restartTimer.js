module.exports = {
    /**
     * @param {function} function_to_restart The function to restart
     * @param {number} seconds Seconds before we restart the function
     * @param {number} timer The time in milliseconds on each call [at the end of the setInterval (timer)] the function
     * @param {string} type [interval] [timeout] Type of the set (interval or timeout)
     * @param returns Nothing
     */
    function(function_to_restart, seconds, timer, type) {
        if (seconds == null || seconds == undefined) { seconds = 1; }
        if (type.toLowerCase() == "interval") {
            clearInterval(function_to_restart);
            setTimeout(() => {
                setInterval(() => {
                    function_to_restart;
                }, timer);
            }, seconds * 1000);

        } else if (type.toLowerCase() == "timeout") {
            clearTimeout(function_to_restart);
            setTimeout(() => {
                setTimeout(() => {
                    function_to_restart;
                }, timer);
            }, seconds * 1000);

        }

        return;
    }
}
