module.exports = {
    function(command, needed_permission) {
        return `You are not allowed to use the command ${command}, you need the permission ${needed_permission} !`
    }
}