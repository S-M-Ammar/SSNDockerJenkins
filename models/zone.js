let mongoose = require('mongoose')

let zone_schema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    workshop_id:{
        type:String,
        required:true
    },
    min_temperature:{
        type:Number,
        required:true
    },
    max_temperature:{
        type:Number,
        required:true
    },
    min_humidity:{
        type:Number,
        required:true
    },
    max_humidity:{
        type:Number,
        required:true
    }

})

let zone = mongoose.model('Zone',zone_schema)

module.exports = zone