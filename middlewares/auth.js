const jwt = require('../modules/jwt')
const MSG = require('../modules/responseMessage')
const JWTCONST = require('../constants/JWTCONST')

const auth =() => async (req, res, next)=>{
    console.log(req.url)
    if(req.url === 'api/user/signup' || req.url === '/api/user/signin')
        return next()
    var token = req.headers.token
    if(!token)
        return res.json({success:false, msg:MSG.EMPTY_TOKEN})
    const user = await jwt.verify(token)
    if(user == JWTCONST.JWT_EXPIRED_ERRCODE)
        return res.json({success:false, msg:MSG.EXPIRED_TOKEN})
    if(user == JWTCONST.INVALID_TOKEN_ERRCODE)
        return res.json({success:false, msg:MSG.INVALID_TOKEN})
    if(user.id === undefined )
        return res.json({success:false, msg:MSG.INVALID_TOKEN})
    req.id = user.id
    next()
}

module.exports = auth