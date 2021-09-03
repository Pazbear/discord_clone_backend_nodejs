const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')

const app = express()
const router = express.Router()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

/***************** IMPORT ******************/
const {Log} = require('./utils/Log')
const {PORT} = require('./configs/InitConfig')

/*******************************************/
/*****************SEQUELIZE*****************/

const sequelize = require('./models').sequelize
sequelize.sync()

/*******************************************/
/******************* PM2 *******************/
/*let isDisableKeepAlive = false

app.use((req, res, next) => {
    if (isDisableKeepAlive) {
        res.set(`Connection`, `close`)
    }
    next()
})

process.on(`SIGINT`, async () => {
    isDisableKeepAlive = true
    console.log(`try closing server`)
    await app.close(() => {
        console.log(`server closed`)
        process.exit(0)
    })
})
*/
/*******************************************/

app.use(router.get('/', (req, res) => {
    Log('e', "hihi")
    return res.send({success:true})
}))

app.listen(PORT, () => {
    /*process.send(`ready`)*/
    console.log(`Server Listening on ${PORT}`)
})