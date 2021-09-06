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
            res.send({success:false, err})
        }
        USER.create({
            email:req.body.email,
            password:hash,
            name:req.body.name,
            avatar:req.body.avatar,
        }).catch(err =>{
            Log("e", `/api/user/signup failed\n${err}`)
            return res.send({success:false, err})
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
                return res.send({success:false, err})
            }
            if(isMatch){
                jwt.sign(user, (err, JWTToken)=>{
                    if(err){
                        Log('e', `/api/user/signin failed\n${err}`)
                        return res.send({success:false, err})
                    }
                    return res.send({success:true, result:user, token:JWTToken.token})
                })
            }else{
                return res.send({success:false, msg : MSG.LOGIN_FAILED_MSG})
            }
        })
    }
})



module.exports = router