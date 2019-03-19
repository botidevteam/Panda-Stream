module.exports = {
    function(data) {
        //admet-on on a 429736115
        const dataString = String(data)

        if (dataString.length >= 4) {
            console.log("Higher than 4")
            console.log(`${dataString} - ${dataString.length}`)
            
        }
    }
}