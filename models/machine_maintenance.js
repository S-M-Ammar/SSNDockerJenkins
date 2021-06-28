let mongoose = require('mongoose')
let moment = require('moment-timezone')
let machine_service_schema = mongoose.Schema({

    machine_id:{
        type:String,
        required:true
    },
    maintenance_recurrence_period_hours:{
        type:Number,
        required:true
    },
    maintenance_history:{
      type:Array,
      required:true
    },
    timestamp:{
        type:Date,
        default:moment().toDate()
    }

})
let machine_service_model = mongoose.model("Machine_Maintenance",machine_service_schema)

module.exports = machine_service_model