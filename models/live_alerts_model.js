let mongoose = require('mongoose')

let live_alert_schema = mongoose.Schema({

    zone_id:{
        type:String,
        required:true,
        trim:true
    },
    node_id:{
        type:String,
        required:true
    },
    alert_type:{
        type:String,
        required:true
    },
    alert_level:{
        type:Number,
        required:true
    },
    parameter_value:{
        type:Number,
        required:true
    },
    start_time:{
        type:Date,
        required:true
    },
    end_time:{
        type:Date,
        required:true
    },
    stop_flag:{
        type:Boolean,
        required:true
    }

})
let live_alert_model = mongoose.model("Alert_Model",live_alert_schema)

module.exports = live_alert_model