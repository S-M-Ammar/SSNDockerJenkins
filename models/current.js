let mongoose = require('mongoose')

let current_schema = mongoose.Schema({

    machine_id:{
        type:String,
        required:true,
        trim:true
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
let current = mongoose.model("Current",current_schema)

module.exports = current