const randToken = require('rand-token')
const jwt = require('jsonwebtoken')
const {secretKey, options} = require('../config/jwtconfig')
const JWTConst = require('../constants/JWTConst.json')

module.exports = {
    sign: async(user) =>{
        const payload = {
            idx : user.id,
            email : user.email,
        }
        const result = {
            token : jwt.sign(payload, secretKey, options),
            refreshToken : randToken.uid(256)
        }
        return result
    },
    verify: async(token) =>{
        let decoded
        try{
            decoded = jwt.verify(token, secretKey)
        }catch(err){
            if (err.message === JWTConst.JWT_EXPIRED_ERRMSG) {
                console.log(JWTConst.JWT_EXPIRED_ERRMSG);
                return JWTConst.JWT_EXPIRED_ERRCODE;
            } else if (err.message === JWTConst.INVALID_TOKEN_ERRMSG) {
                console.log(JWTConst.INVALID_TOKEN_ERRMSG);
                return JWTConst.INVALID_TOKEN_ERRCODE;
            } else {
                console.log(JWTConst.INVALID_TOKEN_ERRMSG);
                return JWTConst.INVALID_TOKEN_ERRCODE;
            }
        }
        return decoded;
    }
}