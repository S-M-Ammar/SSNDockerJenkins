let mongoose = require('mongoose')

let demo_schema = mongoose.Schema({

    machine_id:{
        type:String,
        required:true,
        trim:true
    },
    message_id:{
        type:Number,
        default:8
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
    ssn_uptime:{
        type:Date,
        required:true
    },
    abnormal_activity:{
        type:String,
        required:true
    },
    load_current:{
        type:Number,
        required:true
    },
    load_current_percentage:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    machine_state_timestamp:{
        type:Date,
        required:true
    },
    machine_state_duration:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        required:true
    }
})
let demo_model = mongoose.model("Demo_Model",demo_schema)

module.exports = demo_model