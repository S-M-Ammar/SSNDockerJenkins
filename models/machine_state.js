
//condition:-> if start time and state is changed, => create
// other wise update
let mongoose = require('mongoose')

let machine_state_schema = mongoose.Schema({

    machine_id:{
        type:String,
        required:true
    },
    state:{
        type:String,
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
    timestamp:{
        type:Date,
        required: true
    }

})

let machine_state = mongoose.model('Machine_State',machine_state_schema)

module.exports = machine_state