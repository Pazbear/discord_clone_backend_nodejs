const moment = require('moment')
require('moment-timezone')
moment.tz.setDefault("Asia/Seoul")
/*
const colors = {
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
    white: "\x1B[37m"
}

const loggerColorMap = {
    'e':colors.red,
    'i':colors.white,
    's':colors.green,
    'd':colors.cyan
}
*/
exports.Log = (tag, contents)=>{
    const coloredLog = (tag, log) =>{
        var logColor=""
        switch(tag){
            case 'i':
                logColor="\x1B[37m"
                break
            case 'e':
                logColor="\x1b[31m"
                break
            case 's':
                logColor="\x1b[32m"
                break
            case 'd':
                logColor="\x1b[36m"
                break
            default:
                logColor="\x1B[37m"
                break
        }
        return `${logColor}${log}`
    }
    
    const log = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]\n${contents}${'\x1b[0m'}`

    console.log(coloredLog(tag, log))
}