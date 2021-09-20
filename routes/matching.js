const express = require('express')
const router = express.Router()

const MSG = require('../modules/responseMessage')
const { Log } = require('../utils/Log')

const { USER, MATCHING, Sequelize } = require('../models')

router.post('/getMatching', async(req, res)=>{
    MATCHING.findOne({where:{
        [Sequelize.Op.or]:[
            {
                [Sequelize.Op.and]:[
                    {user1Id : req.id},
                    {createdAt : req.body.nowDate}
                ]
            },
            {
                [Sequelize.Op.and]:[
                    {user2Id : req.id},
                    {createdAt : req.body.nowDate}
                ]
            }
        ]
    }}).catch(err =>{
        Log("e", `/api/matching/getMatching failed\n${err}`)
        return res.send({success:false, err, msg:MSG.DB_ERR})
    }).then(result =>{
        Log("s", "/api/matching/getMatching success")
        if(!result){
            return res.send({success:true, msg:MSG.NOT_MATCHED})
        }
        return res.send({success:true, result:result})
    })
})

router.post('/setMatching', async(req, res)=>{
    const randUser = await USER.findOne(
        {
            where:{
                [Sequelize.Op.and]:[
                    {
                        [Sequelize.Op.not]:[{id : req.id}]
                    },
                    {
                        isMatched:0
                    }
                ]
            },
            order:[Sequelize.literal('rand()')]
        })
    console.log(randUser)
    const partner = {
        name : randUser.name,
        avatar : randUser.avatar,
        fcm_token : randUser.fcm_token
    }
    MATCHING.create({
        user1Id:req.id,
        user2Id:randUser.id,
        createdAt:req.body.nowDate
    }).catch(err =>{
        Log("e", `/api/matching/setMatching failed\n${err}`)
        return res.send({success:false, err, msg:MSG.DB_ERR})
    }).then(result =>{
        Log("s", "/api/matching/setMatching success")
        if(!result){
            return res.send({success:true, err, msg:MSG.NOT_MATCHED})
        }
        USER.update({isMatched:true}, {where:{
            [Sequelize.Op.or]:[{id:req.id},{id:randUser.id}]
        }}).catch(err =>{
            Log("e", `/api/matching/setMatching failed\n${err}`)
            return res.send({success:false, err, msg:MSG.DB_ERR})
        }).then(result =>{
            return res.send({success:true, result:partner})
        })
    })
})

module.exports = router