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
        return res.send({success:false, msg:MSG.DB_ERR})
    }).then(result =>{
        Log("s", "/api/matching/getMatching success")
        if(!result){
            return res.send({success:true, result:null, msg:MSG.MATCH_USER_NOT_EXIST})
        }
        const partnerId = result.user1Id===req.id ? result.user2Id : result.user1Id
        USER.findOne({where : {id : partnerId}})
        .catch(err => {
            Log("e", `/api/matching/getMatching failed\n${err}`)
            return res.send({success:false, msg:MSG.DB_ERR})
        }).then(partner =>{
            return res.send({success:true, result:partner})
        })
    })
})

router.post('/setMatching', async(req, res)=>{
    console.log("111111111")
    const matched = await MATCHING.findOne(
        {
            where:{
                [Sequelize.Op.and]:[
                    {
                        [Sequelize.Op.or]:[{
                            user1Id : req.id
                        },{
                            user2Id : req.id
                        }]
                    },
                    {
                        createdAt:req.body.nowDate
                    }
                ]
            }
        }
    )
    console.log("matched : "+matched)
    if(matched){
        const partnerId = matched.user1Id === req.id ? matched.user2Id : matched.user1Id
        USER.findOne(
            {
                where:{
                    id : partnerId
                }
            }
        ).catch(err =>{
            Log("e", `/api/matching/setMatching failed\n${err}`)
            return res.send({success:false, msg:MSG.DB_ERR})
        }).then(partner =>{
            return res.send({success:true, result:partner})
        })
    }else{
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
            return res.send({success:false, msg:MSG.DB_ERR})
        }).then(result =>{
            Log("s", "/api/matching/setMatching success")
            if(!result){
                return res.send({success:true, msg:MSG.NOT_MATCHED})
            }
            USER.update({isMatched:true}, {where:{
                [Sequelize.Op.or]:[{id:req.id},{id:randUser.id}]
            }}).catch(err =>{
                Log("e", `/api/matching/setMatching failed\n${err}`)
                return res.send({success:false, msg:MSG.DB_ERR})
            }).then(result =>{
                return res.send({success:true, result:partner})
            })
        })
    }
})

module.exports = router