let mongoose = require('mongoose')

let workshop_schema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    }

})

let workshop = mongoose.model('WorkShop',workshop_schema)

module.exports = workshop