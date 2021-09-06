const bcrypt = require('bcrypt')
const saltRounds = 10;

module.exports = {
    encryptPassword: async (password, cb)=>{
        console.log(password)
        bcrypt.genSalt(saltRounds, (err, salt)=>{
            if(err) return cb(err)
            bcrypt.hash(password, salt, (err, hash)=>{
                if(err) return cb(err)
                return cb(null, hash)
            })
        })
    },

    comparePassword: async (plainPassword, password, cb) =>{
        bcrypt.compare(plainPassword, password, (err, isMatch)=>{
            if(err) return cb(err)
            cb(null, isMatch)
        })
    }
}