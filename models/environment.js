let mongoose = require('mongoose')

let environment_schema = mongoose.Schema({

    zone_id:{
        type:String,
        required:true
    },
    node_id:{
        type:String,
        required:true
    },
    temperature:{
      type:Number,
      required:true
    },
    humidity:{
        type:Number,
        required:true
    },
    temperature_alert:{
        type:Number,
        required:true
    },
    humidity_alert:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        required: true
    }


})

let environment = mongoose.model('Environment',environment_schema)

module.exports = environment