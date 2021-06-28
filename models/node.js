let mongoose = require('mongoose')

let node_schema = mongoose.Schema({

    mac:{
        type:String,
        required:true,
        trim:true
    },
    ip:{
        type:String,
        default: undefined,
        trim:true
    },
    sensor_1_rating:{
        type:Number,
        required: true
    },
    sensor_2_rating:{
        type:Number,
        required: true
    }

})

let node = mongoose.model('Node',node_schema)

module.exports = node