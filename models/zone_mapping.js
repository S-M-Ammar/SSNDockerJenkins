let mongoose = require('mongoose')

let zone_mapping_schema = mongoose.Schema({

    zone_id:{
        type:String,
        required:true
    },
    node_id:{
        type:String,
        required:true
    }

})

let zone_mapping = mongoose.model('Zone_Mapping',zone_mapping_schema)

module.exports = zone_mapping