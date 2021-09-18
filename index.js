const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')
const dotenv = require('dotenv')

const app = express()
const router = express.Router()

/****************** UTIL *******************/
const {Log} = require('./utils/Log')
/*******************************************/
/*************** MIDDLEWARE ****************/
const auth = require('./middlewares/auth')
/*******************************************/
/***************** SET UP ******************/
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(auth())
/*******************************************/
/*************** ENV Config ****************/
dotenv.config({
    path:path.resolve(
        process.cwd(),
        process.env.NODE_ENV == "production" ? "./env/.env" : "./env/.env.dev"
    )
})

/*******************************************/
/*****************SEQUELIZE*****************/
if (process.env.INSTANCE_ID == 0) {
    const sequelize = require('./models').sequelize
    sequelize.sync({ force: false })
    .then(() => {
        console.log('DB Connected');
    }).catch((err) => {
        console.error(err);
    })
}
/*******************************************/
/******************ROUTES*******************/
app.use('/api/user', require('./routes/user'))
app.use('/api/matching', require('./routes/matching'))

/*******************************************/


/******************* PM2 *******************/
let isDisableKeepAlive = false

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

/*******************************************/

app.use(router.get('/', (req, res) => {
    Log('e', "hihi")
    return res.send({success:true})
}))

app.listen(process.env.PORT, () => {
    /*process.send(`ready`)*/
    console.log(`${process.env.NODE_ENV}`)
    console.log(`Server Listening on ${process.env.PORT}`)
})