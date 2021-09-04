const express = require('express')
const router = express.Router()

const { Log } = require('../utils/Log')

const { USER } = require('../models')

/**************INFO***************/
/*  /api/user/create
req => email:string, password:string, name:string, avatar:string
res => success:boolean
*/
/*********************************/
router.post('/create', (req, res)=>{
    USER.create({
        email:req.body.email,
        password:req.body.password,
        name:req.body.name,
        avatar:req.body.avatar,
    }).catch(err =>{
        Log("e", "/api/user/create failed")
        return res.send({success:false})
    }).then(result => {
        Log("s", "/api/user/create success")
        return res.send({success:true})
    })
})

module.exports = router