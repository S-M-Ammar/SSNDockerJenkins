let mongoose = require('mongoose')

let node_status_schema = mongoose.Schema({

    node_id:{
        type:String,
        required:true
    },
    node_up_time:{
        type:Date,
        required:true
    },
    abnormal_activity:{
        type:String,
        required:true
    },
   status:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        required:true
    }


})

let node_status = mongoose.model('Environment',node_status_schema)

module.exports = node_status