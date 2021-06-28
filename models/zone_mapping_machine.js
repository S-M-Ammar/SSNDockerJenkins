let mongoose = require('mongoose')

let zone_mapping_machine_schema = mongoose.Schema({

    zone_id:{
        type:String,
        required:true
    },
    machine_id:{
        type:String,
        required:true
    }

})

let zone_machine_mapping = mongoose.model('Zone_Machine_Mapping',zone_mapping_machine_schema)

module.exports = zone_machine_mapping