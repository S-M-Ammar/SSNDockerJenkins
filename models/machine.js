let mongoose = require('mongoose')

let machine_schema = mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    idle_threshold:{
        type:Number,
        required: true
    },
    max_load:{
        type:Number,
        required:true
    },
    sensor_voltage_scalar:{
        type:Number,
        required:true,
        validate(value) {
            if(value!==0 && value!==1 && value!==2){
                throw new Error("sensor voltage scalar value must be 0 or 1 or 2")
            }
        }
    }

})
let machine = mongoose.model("Machine",machine_schema)

module.exports = machine