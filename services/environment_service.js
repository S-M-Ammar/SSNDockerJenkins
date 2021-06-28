let zone_mapping_model = require('../models/zone_mapping')
let environment_model = require('../models/environment')
let zone_model = require('../models/zone')
let live_alerts_model = require('../models/live_alerts_model')

let store_environment_data = async (parsed_data,node_id)=>{

    return new Promise((async (resolve, reject) => {
        try{

            let zone_mapping_response = await zone_mapping_model.find({node_id:node_id})

            if(zone_mapping_response.length>=1){

                let zone_id = (zone_mapping_response[0]).zone_id
                let zone_model_response = await zone_model.find({_id:zone_id})
                let temp_min_threshold = (zone_model_response[0]).min_temperature
                let temp_max_threshold = (zone_model_response[0]).max_temperature
                let humid_min_threshold = (zone_model_response[0]).min_humidity
                let humid_max_threshold = (zone_model_response[0]).max_humidity

                let temperature_alert = 0
                let humidity_alert = 0

                if(parsed_data.temperature <= temp_max_threshold && parsed_data.temperature >=temp_min_threshold){
                    temperature_alert = 0
                }
                else {

                    if(parsed_data.temperature > temp_max_threshold){
                        temperature_alert = 1
                    }
                    else {
                        temperature_alert = -1
                    }

                }

                if(parsed_data.humidity <= humid_max_threshold && parsed_data.humidity >= humid_min_threshold){

                    humidity_alert = 0
                }
                else {

                    if(parsed_data.humidity > humid_max_threshold){
                        humidity_alert = 1
                    }
                    else{
                        humidity_alert = -1
                    }

                }

                let environment_model_ = new environment_model({
                        zone_id:zone_id,
                        node_id:node_id,
                        temperature:parsed_data.temperature,
                        humidity:parsed_data.humidity,
                        temperature_alert:temperature_alert,
                        humidity_alert:humidity_alert,
                        timestamp:parsed_data.timestamp
                    })

                //*******************************************************************************************************************************//
                // before sending data to client from socket, implement alert system logic here....//

                if(temperature_alert==1){

                    // stop min threshold last alert
                    let min_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_temp_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(min_temp_alert_data[0]._id,{stop_flag:true})
                    }


                    //first of all check db records. if db hold no records, add it directly with same start and end time, making stop flag equal to false
                    let max_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_temp_alert_data.length==1){


                        // check latest temperature_max_threshold record stop flag. If stop is true then add new record, otherwise update end time
                        if(max_temp_alert_data[0].stop_flag==false){

                            await live_alerts_model.findByIdAndUpdate(max_temp_alert_data[0]._id,{end_time:parsed_data.timestamp,parameter_value:parsed_data.temperature})
                        }
                        else{

                            let new_alert_record = new live_alerts_model({
                                zone_id:zone_id,
                                node_id:node_id,
                                alert_type:"temperature",
                                alert_level:1,
                                parameter_value:parsed_data.temperature,
                                start_time:parsed_data.timestamp,
                                end_time:parsed_data.timestamp,
                                stop_flag:false

                            })

                            await new_alert_record.save()
                        }

                    }
                    else{
                        // add temperature_max_threshold record in db
                        let new_alert_record = new live_alerts_model({
                            zone_id:zone_id,
                            node_id:node_id,
                            alert_type:"temperature",
                            alert_level:1,
                            parameter_value:parsed_data.temperature,
                            start_time:parsed_data.timestamp,
                            end_time:parsed_data.timestamp,
                            stop_flag:false

                        })

                        await new_alert_record.save()
                    }

                }
                else if(temperature_alert==-1){

                    // stop max threshold last alert
                    let max_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_temp_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(max_temp_alert_data[0]._id,{stop_flag:true})
                    }


                    //first of all check db records. if db hold no records, add it directly with same start and end time, making stop flag equal to false
                    let min_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_temp_alert_data.length==1){

                        // check latest temperature_max_threshold record stop flag. If stop is true then add new record, otherwise update end time
                        if(min_temp_alert_data[0].stop_flag==false){

                            await live_alerts_model.findByIdAndUpdate(min_temp_alert_data[0]._id,{end_time:parsed_data.timestamp,parameter_value:parsed_data.temperature})
                        }
                        else{

                            let new_alert_record = new live_alerts_model({
                                zone_id:zone_id,
                                node_id:node_id,
                                alert_type:"temperature",
                                alert_level:-1,
                                parameter_value:parsed_data.temperature,
                                start_time:parsed_data.timestamp,
                                end_time:parsed_data.timestamp,
                                stop_flag:false


                            })

                            await new_alert_record.save()
                        }

                    }
                    else{
                        // add temperature_min_threshold record in db
                        let new_alert_record = new live_alerts_model({
                            zone_id:zone_id,
                            node_id:node_id,
                            alert_type:"temperature",
                            alert_level:-1,
                            parameter_value:parsed_data.temperature,
                            start_time:parsed_data.timestamp,
                            end_time:parsed_data.timestamp,
                            stop_flag:false

                        })

                        await new_alert_record.save()
                    }


                }

                if(humidity_alert==1){

                    // stop min threshold last alert
                    let min_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_humd_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(min_humd_alert_data[0]._id,{stop_flag:true})
                    }

                    //check db for records
                    let max_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_humd_alert_data.length==1){

                        // check latest humidity_max_threshold record stop flag. If stop is true then add new record, otherwise update end time
                        if(max_humd_alert_data[0].stop_flag==false){

                            await live_alerts_model.findByIdAndUpdate(max_humd_alert_data[0]._id,{end_time:parsed_data.timestamp,parameter_value:parsed_data.humidity})
                        }
                        else{

                            let new_alert_record = new live_alerts_model({
                                zone_id:zone_id,
                                node_id:node_id,
                                alert_type:"humidity",
                                alert_level:1,
                                parameter_value:parsed_data.humidity,
                                start_time:parsed_data.timestamp,
                                end_time:parsed_data.timestamp,
                                stop_flag:false

                            })

                            await new_alert_record.save()
                        }

                    }
                    else{

                        // add humidity_max_threshold record in db
                        let new_alert_record = new live_alerts_model({
                            zone_id:zone_id,
                            node_id:node_id,
                            alert_type:"humidity",
                            alert_level:1,
                            parameter_value:parsed_data.humidity,
                            start_time:parsed_data.timestamp,
                            end_time:parsed_data.timestamp,
                            stop_flag:false

                        })

                        await new_alert_record.save()
                    }

                }
                else if(humidity_alert==-1){

                    // stop max threshold last alert
                    let max_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_humd_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(max_humd_alert_data[0]._id,{stop_flag:true})
                    }

                    //check db for records
                    let min_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_humd_alert_data.length==1){

                        // check latest humidity_max_threshold record stop flag. If stop is true then add new record, otherwise update end time
                        if(min_humd_alert_data[0].stop_flag==false){

                            await live_alerts_model.findByIdAndUpdate(min_humd_alert_data[0]._id,{end_time:parsed_data.timestamp,parameter_value:parsed_data.humidity})
                        }
                        else{

                            let new_alert_record = new live_alerts_model({
                                zone_id:zone_id,
                                node_id:node_id,
                                alert_type:"humidity",
                                alert_level:-1,
                                parameter_value:parsed_data.humidity,
                                start_time:parsed_data.timestamp,
                                end_time:parsed_data.timestamp,
                                stop_flag:false

                            })

                            await new_alert_record.save()
                        }

                    }
                    else{

                        // add humidity_min_threshold record in db
                        let new_alert_record = new live_alerts_model({
                            zone_id:zone_id,
                            node_id:node_id,
                            alert_type:"humidity",
                            alert_level:-1,
                            parameter_value:parsed_data.humidity,
                            start_time:parsed_data.timestamp,
                            end_time:parsed_data.timestamp,
                            stop_flag:false

                        })

                        await new_alert_record.save()
                    }


                }

                if(temperature_alert==0){

                    // stop temp min threshold last alert
                    let min_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_temp_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(min_temp_alert_data[0]._id,{stop_flag:true})
                    }

                    // stop temp max threshold last alert
                    let max_temp_alert_data = await live_alerts_model.find({alert_type:"temperature",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_temp_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(max_temp_alert_data[0]._id,{stop_flag:true})
                    }

                }
                if(humidity_alert==0){

                    // stop humidity min threshold last alert
                    let min_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:-1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(min_humd_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(min_humd_alert_data[0]._id,{stop_flag:true})
                    }

                    // stop humidity max threshold last alert
                    let max_humd_alert_data = await live_alerts_model.find({alert_type:"humidity",alert_level:1,zone_id:zone_id,node_id:node_id}).sort({_id:-1}).limit(1)
                    if(max_humd_alert_data.length==1){
                        await live_alerts_model.findByIdAndUpdate(max_humd_alert_data[0]._id,{stop_flag:true})
                    }

                }

                //**********************************************************************************************************************************//

                    // if(parsed_data.temperature!=0 && parsed_data.humidity!=0)
                    if(1){
                        environment_model_.save().then(()=>{
                            resolve("Environment data saved to database")
                        }).catch((e)=>{
                            resolve("Unable to save environment data to database")
                        })
                    }
                    else {
                        resolve("Environment data not saved due to temperature/humidity value == 0")
                    }

                }
                else{
                    resolve("No zone found against node")
            }
        }
        catch (e){
            reject("Error while saving environment data to database.")
        }
    }))

}

module.exports = {store_environment_data}