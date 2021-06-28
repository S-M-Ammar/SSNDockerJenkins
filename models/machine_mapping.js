let mongoose = require('mongoose')

let machine_mapping_schema = mongoose.Schema({

    machine_id:{
        type:String,
        required:true
    },
    node_id:{
        type:String,
        required:true
    },
    sensor_number:{
        type:Number,
        required:true,
        validate(value){
            if(value!==undefined){
                if(value<=0 || value>=3){
                    throw new Error('Sensor number is invalid')
                }
            }
        }
    }

})

let machine_mapping = mongoose.model('Machine_Mapping',machine_mapping_schema)

module.exports = machine_mapping