const express = require('express')
const router = express.Router()
const jwt = require('../modules/jwt')
const encrypt = require('../modules/encrypt')

const MSG = require('../modules/responseMessage')
const { Log } = require('../utils/Log')

const { USER } = require('../models')

/**************INFO***************/
/*  /api/user/create
req => email:string, password:string, name:string, avatar:string
res => success:boolean
*/
/*********************************/
router.post('/signup', async (req, res)=>{
    encrypt.encryptPassword(req.body.password, (err, hash) =>{
        if(err){
            Log('e', `/api/user/signup failed\n${err}`)
            res.send({success:false})
        }
        USER.create({
            email:req.body.email,
            password:hash,
            name:req.body.name,
            avatar:req.body.avatar,
        }).catch(err =>{
            Log("e", `/api/user/signup failed\n${err}`)
            return res.send({success:false, msg:MSG.DB_ERR})
        }).then(result => {
            Log("s", "/api/user/signup success")
            return res.send({success:true})
        })
    })
})

router.post('/signin', async(req, res)=>{
    const user = await USER.findOne({where:{email:req.body.email}})
    if(user){
        encrypt.comparePassword(req.body.password, user.password, (err, isMatch)=>{
            if(err){
                Log('e', `/api/user/signin failed\n${err}`)
                return res.send({success:false})
            }
            if(isMatch){
                jwt.sign(user, (err, JWTToken)=>{
                    if(err){
                        Log('e', `/api/user/signin failed\n${err}`)
                        return res.send({success:false})
                    }
                    if(user.token === req.body.fcm_token){
                        Log("s", "/api/user/signin success(same phone)")
                        return res.send({success:true, result:user, token:JWTToken.token})
                    }else{
                        USER.update({fcm_token:req.body.fcm_token}, {where: { email:req.body.email }})
                        .catch(err => {
                            Log("e", `/api/user/signin failed\n${err}`)
                            return res.send({success:false, msg:MSG.DB_ERR})
                        }).then(result => {
                            Log("s", "/api/user/signin success(other phone)")
                            return res.send({success:true, result:user, token:JWTToken.token})
                        })
                    }
                })
            }else{
                Log("e", `/api/user/signin failed\n`)
                return res.send({success:false, msg : MSG.LOGIN_FAILED_MSG})
            }
        })
    }else{
        return res.send({success:false, msg : MSG.NOT_USER})
    }
})

router.post('/checkEmailValidate', async(req, res)=>{
    const user = await USER.findOne({where:{email:req.body.email}})
    if(user){
        return res.send({success:false, msg:MSG.EMAIL_ALREADY_EXIST})
    }else{
        return res.send({success:true})
    }
})



module.exports = router