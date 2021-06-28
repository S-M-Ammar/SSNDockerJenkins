let current = require('../models/current')
let machine_mapping = require('../models/machine_mapping')
let demo_model = require('../models/demo_model')
let machine_status_model = require('../models/machine_state')
let moment = require('moment-timezone')


let store_current_data = async (parsed_data,node_id)=>{

    return new Promise((async (resolve, reject) => {
        try{

            let machine_mapping_response = await machine_mapping.find({node_id:node_id})

            if(machine_mapping_response.length>=1){

                machine_mapping_response.forEach((machine_mapping_)=>{
                    if(machine_mapping_.sensor_number==1){
                        let current_ = new current({
                            machine_id:machine_mapping_.machine_id,
                            load_current:parsed_data.machine_load_currents[0],
                            status:parsed_data.machine_status[0],
                            load_current_percentage:parsed_data.machine_load_percentages[0],
                            machine_state_timestamp:parsed_data.machine_state_timestamp[0],
                            machine_state_duration:parsed_data.machine_state_duration[0],
                            timestamp:parsed_data.timestamp
                        })


                        let machine_state_data = new machine_status_model({
                            machine_id : current_.machine_id,
                            state:current_.status,
                            start_time:current_.machine_state_timestamp,
                            // end_time:new Date(current_.machine_state_timestamp.getTime() + (current_.machine_state_duration*1000)),
                            end_time:moment(current_.machine_state_timestamp.getTime() + (current_.machine_state_duration*1000)).toDate(),
                            timestamp:parsed_data.timestamp
                        })

                        machine_status_model.find({machine_id:current_.machine_id}).sort({_id:-1}).limit(1).then((result)=>{
                            if(result.length>=1){
                                let last_entry = result[0]
                                // console.log("Last Entry Start time => "+last_entry.start_time)
                                // console.log("Current Start time => "+current_.machine_state_timestamp)
                                if(last_entry.start_time.getTime()==current_.machine_state_timestamp.getTime() && last_entry.state==current_.status){

                                    machine_status_model.findByIdAndUpdate(last_entry._id,{end_time:moment(current_.machine_state_timestamp.getTime() + (current_.machine_state_duration*1000)).toDate()}).then((res)=>{
                                        console.log("machine state updated")
                                    }).catch((e)=>{
                                        console.log(e)
                                    })

                                }
                                else {
                                    machine_state_data.save()
                                    console.log("New record added for machine state")
                                }
                            }
                            else {
                                machine_state_data.save()
                                console.log("New record added for machine state")
                            }
                        }).catch((e)=>{
                            console.log(e)
                        })

                        current_.save().then(()=>{
                            console.log("Machine-1 current data saved")
                        }).catch((e)=>{
                            console.log(e)
                        })

                        let demo_data = new demo_model({
                            machine_id:current_.machine_id,
                            load_current:current_.load_current,
                            status:current_.status,
                            load_current_percentage:current_.load_current_percentage,
                            machine_state_timestamp:current_.machine_state_timestamp,
                            machine_state_duration:current_.machine_state_duration,
                            node_id:parsed_data.node_id,
                            temperature:parsed_data.temperature,
                            humidity:parsed_data.humidity,
                            ssn_uptime:parsed_data.ssn_uptime,
                            abnormal_activity:parsed_data.abnormal_activity,
                            timestamp:parsed_data.timestamp
                        })
                        demo_data.save().then(()=>{
                            console.log("Demo Model Data Saved Successfully")
                        }).catch((e)=>{
                            console.log("Unable to save demo data")
                        })
                    }
                    else if(machine_mapping_.sensor_number==2){
                        let current_ = new current({
                            machine_id:machine_mapping_.machine_id,
                            load_current:parsed_data.machine_load_currents[1],
                            status:parsed_data.machine_status[1],
                            load_current_percentage:parsed_data.machine_load_percentages[1],
                            machine_state_timestamp:parsed_data.machine_state_timestamp[1],
                            machine_state_duration:parsed_data.machine_state_duration[1],
                            timestamp:parsed_data.timestamp
                        })

                        let machine_state_data = new machine_status_model({
                            machine_id : current_.machine_id,
                            state:current_.status,
                            start_time:current_.machine_state_timestamp,
                            end_time:moment(current_.machine_state_timestamp.getTime() + (current_.machine_state_duration*1000)).toDate(),
                            timestamp:parsed_data.timestamp
                        })

                        machine_status_model.find({machine_id:current_.machine_id}).sort({_id:-1}).limit(1).then((result)=>{
                            if(result.length>=1){
                                let last_entry = result[0]
                                if(last_entry.start_time.getTime()==current_.machine_state_timestamp.getTime() && last_entry.state==current_.status){

                                    machine_status_model.findByIdAndUpdate(last_entry._id,{end_time:moment(current_.machine_state_timestamp.getTime() + (current_.machine_state_duration*1000)).toDate()}).then((res)=>{
                                        console.log("machine state updated")
                                    }).catch((e)=>{
                                        console.log(e)
                                    })

                                }
                                else {
                                    machine_state_data.save()
                                }
                            }
                            else {
                                machine_state_data.save()
                            }
                        }).catch((e)=>{
                            console.log(e)
                        })


                        current_.save().then(()=>{
                            console.log("Machine-2 current data saved")
                        }).catch((e)=>{
                            console.log(e)
                        })


                        let demo_data = new demo_model({
                            machine_id:current_.machine_id,
                            load_current:current_.load_current,
                            status:current_.status,
                            load_current_percentage:current_.load_current_percentage,
                            machine_state_timestamp:current_.machine_state_timestamp,
                            machine_state_duration:current_.machine_state_duration,
                            node_id:parsed_data.node_id,
                            temperature:parsed_data.temperature,
                            humidity:parsed_data.humidity,
                            ssn_uptime:parsed_data.ssn_uptime,
                            abnormal_activity:parsed_data.abnormal_activity,
                            timestamp:parsed_data.timestamp
                        })
                        demo_data.save().then(()=>{
                            console.log("Demo Model Data Saved Successfully")
                        }).catch((e)=>{
                            console.log("Unable to save demo data")
                        })
                    }
                })
                resolve("Current data saved successfully to database")
            }
            else{
                resolve("No machine found against node-sensor")
            }
        }
        catch (e) {
            reject("Error while saving current data to database.")
        }

    }))
}

module.exports = {store_current_data}
