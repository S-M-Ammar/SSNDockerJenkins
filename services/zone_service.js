let zone = require('../models/zone')
let zone_mapping_model = require('../models/zone_mapping')
let configuration_service = require('../services/configuration_service')
let node_model = require('../models/node')
let machine_mapping_model = require('../models/machine_mapping')
let machine_model = require('../models/machine')
let environment_model = require('../models/environment')
let node_service = require('../services/node_service')
let demo_model = require('../models/demo_model')
let machine_service = require('../services/machine_service')
let zone_mapping_machine_model = require('../models/zone_mapping_machine')
let moment = require('moment-timezone')

class zone_service{

    async get_all_zones(){

        return await zone.find({})
    }

    async get_one_zone(id){

        return await zone.find({_id:id})
    }

    async create_zone(parameters){

        let _zone = zone(parameters)
        return await _zone.save()
    }

    async update_zone(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id
        let zone_mapping_response = await zone_mapping_model.find({zone_id:id})
        if(zone_mapping_response.length>=1){
            let node_id = zone_mapping_response[0].node_id
            configuration_service.send_configuration_message({node_id:node_id}).then((result)=>{
                console.log(result)
            }).catch((error)=>{
                console.log(error)
            })
        }
        return await zone.findByIdAndUpdate(id,update_parameters)


    }

    async get_zone_alerts(id){

        let date_string = moment().tz("Asia/Karachi").format("YYYY-MM-DD")
        let date_ = moment(date_string+"T00:00:00")
        date_.subtract({ hours: 5});
        let end_date_string = date_.format("YYYY-MM-DD")

        //getting machine node data of given day
        let env_data = await environment_model.find({
              zone_id:id,
              timestamp:{$gte:end_date_string+"T19:00:00Z",$lte:date_string+"T18:59:59Z"}
            },
            {
              _id:0,
              __v:0,
              node_id:0
            })

        if(env_data.length==0){

            return []
        }

        // reformatting environment data into single json object by adding arrays and minimizing key value pairs.

        let temperature_array = []
        let humidity_array = []
        let temperature_alert_array = []
        let humidity_alert_array = []
        let timestamp_array = []

        for(let x=0;x<env_data.length;x++){
            temperature_array.push(env_data[x]['temperature'])
            humidity_array.push(env_data[x]['humidity'])
            temperature_alert_array.push(env_data[x]['temperature_alert'])
            humidity_alert_array.push(env_data[x]['humidity_alert'])
            timestamp_array.push(env_data[x]['timestamp'])
        }

        let reformatted_env_data = {
            zone_id:env_data[0]['zone_id'],
            temperature:temperature_array,
            humidity: humidity_array,
            temperature_alert: temperature_alert_array,
            humidity_alert: humidity_alert_array,
            timestamp:timestamp_array
        }


        return reformatted_env_data
    }

    async delete_zone(id){

        let zone_mapping_response = await zone_mapping_model.find({zone_id:id})
        if(zone_mapping_response.length>=1){
            for(let x =0 ; x<=zone_mapping_response.length;x++){
                await zone_mapping_model.delete({zone_id:zone_mapping_response[x].zone_id})
            }
        }

        let zone_mapping_machine_response = await zone_mapping_machine_model.find({zone_id:id})
        if(zone_mapping_machine_response.length>=1){
            for(let x =0 ; x<=zone_mapping_machine_response.length;x++){
                await zone_mapping_machine_model.delete({zone_id:zone_mapping_machine_response[x].zone_id})
            }
        }

        return await zone.findByIdAndDelete(id)

    }

    async get_Nodes_Machines(id){
        let data = {}
        let node_id
        let node_mac
        let res_zone_mapping = await zone_mapping_model.find({zone_id:id})
        if(res_zone_mapping.length>=1){

            for(let x=0;x<res_zone_mapping.length;x++){
                let machines_list = []
                node_id = res_zone_mapping[x].node_id
                let node_res = await node_model.findOne({_id:node_id})

                if(node_res.length!=={} &&node_res!==null){

                    node_mac = node_res.mac

                    let machine_mapping_res = await machine_mapping_model.find({node_id:node_id})
                    if(machine_mapping_res.length>=1){

                        for(let k=0;k<machine_mapping_res.length;k++){
                            let machine_id = machine_mapping_res[k].machine_id
                            let machine_res = await machine_model.findOne({_id:machine_id})
                            let machine_name = machine_res.name
                            let sensor_number = machine_mapping_res[k].sensor_number
                            machines_list.push({"_id":machine_id,"Machine_Name":machine_name,"Sensor_Number":sensor_number,"Node_id":node_id})
                        }
                        data[node_mac] = machines_list
                    }
                    else {
                        data[node_mac] = []
                    }

                }

            }
            return data

        }
        else {
            return []
        }
    }


    async get_zone_summary(id){

        let duration = 24

        let zone_model_response = await this.get_one_zone(id)
        if(zone_model_response.length==0){
            return {} // no zone data found
        }

        let min_temperature = zone_model_response[0].min_temperature
        let max_temperature = zone_model_response[0].max_temperature
        let max_humidity = zone_model_response[0].max_humidity
        let min_humidity = zone_model_response[0].min_humidity

        let zone_node_machine_response = await this.get_Nodes_Machines(id)
        if(zone_node_machine_response.length==0){
            return {} //zone found but no nodes data found
        }

        let nodes_list = Object.keys(zone_node_machine_response)

        let latest_temperatures = []
        let latest_humidities = []

        for(let x=0;x<nodes_list.length;x++){

            let node_id = await node_service.get_node_id(nodes_list[x])
            if(node_id!=""){
                let env_res = await environment_model.find({node_id:node_id}).sort({_id:-1}).limit(1)
                if(env_res.length>=1){
                    latest_temperatures.push(env_res[0].temperature)
                    latest_humidities.push(env_res[0].humidity)
                }
            }
        }

        let humidity;
        let temperature;

        if(latest_humidities.length==0 && latest_temperatures.length==0){

           humidity = 0
           temperature = 0
        }

        else{

            humidity = Math.floor(eval(latest_humidities.join('+')) / latest_humidities.length)
            temperature = Math.floor(eval(latest_temperatures.join('+')) / latest_temperatures.length)
        }



        let machines_list = []

        for(let x=0;x<nodes_list.length;x++){
            //check all machines against nodes
            let machine_single_list = zone_node_machine_response[nodes_list[x]]
            for(let y=0;y<machine_single_list.length;y++){
                try{
                    let machine_object = machine_single_list[y]
                    machine_object['node_mac'] = nodes_list[x]
                    machine_object['node_id'] = await node_service.get_node_id(nodes_list[x])
                    machines_list.push(machine_object)    
                }
                catch (e) {

                    console.log("Error in zone summary. Machines list part")
                    console.log(e)
                }
                
            }
        }



        let machines_data = []
        if(machines_list.length>=1){
            for(let x=0;x<machines_list.length;x++) {

                let demo_model_res = await demo_model.find({machine_id:machines_list[x]._id}).sort({_id:-1}).limit(1)
                if(demo_model_res.length>=1){

                    machines_data.push({

                        _id:machines_list[x]._id,
                        machine_name:machines_list[x].Machine_Name,
                        sensor_number:machines_list[x].Sensor_Number,
                        state_instant:demo_model_res[0].status,
                        state_instant_duration:demo_model_res[0].machine_state_duration,
                        node_mac:machines_list[x].node_mac,
                        node_id:machines_list[x].node_id
                    })

                }

            }

            // get up-time and down-time for machines
            for(let m=0;m<machines_data.length;m++){

                let latest_entry = await demo_model.find({machine_id:machines_data[m]._id}).sort({_id:-1}).limit(1)
                if(latest_entry.length>=1){
                    let end_time = new Date(latest_entry[0].timestamp.getTime())
                    let start_time = new Date(latest_entry[0].timestamp.getTime())
                    start_time.setHours(start_time.getHours() - duration)
                    let utilization = await machine_service.get_utilization(start_time,end_time,latest_entry[0].machine_id)
                    let uptime = 0
                    let downtime = 0
                    if(JSON.stringify(utilization)==JSON.stringify({"ON-Time":"0:00:00","OFF-Time":"0:00:00","IDLE-Time":"0:00:00"})){
                        machines_data[m]['uptime'] = 0
                        machines_data[m]['downtime'] = 0
                        machines_data[m]['utilization_percent'] = 0
                        machines_data[m]['starttime'] = start_time
                        machines_data[m]['endtime'] = end_time
                    }
                    else{

                        let on_time = utilization['ON-Time'].split(":")
                        uptime = uptime + (parseFloat(on_time[0]) * 3600)
                        uptime = uptime + (parseFloat(on_time[1]) * 60)
                        uptime = uptime + (parseFloat(on_time[2]))

                        let off_time = utilization['OFF-Time'].split(":")
                        downtime = downtime + (parseFloat(off_time[0]) * 3600)
                        downtime = downtime + (parseFloat(off_time[1]) * 60)
                        downtime = downtime + (parseFloat(off_time[2]))

                        let idle_time = utilization['IDLE-Time'].split(":")
                        downtime = downtime + (parseFloat(idle_time[0]) * 3600)
                        downtime = downtime + (parseFloat(idle_time[1]) * 60)
                        downtime = downtime + (parseFloat(idle_time[2]))

                        machines_data[m]['uptime'] = uptime
                        machines_data[m]['downtime'] = downtime
                        machines_data[m]['utilization_percent'] = Math.round((uptime / ((end_time-start_time)/1000))*100)
                        machines_data[m]['starttime'] = start_time
                        machines_data[m]['endtime'] = end_time

                    }

                }
                else {
                    machines_data[m]['uptime'] = 0
                    machines_data[m]['downtime'] = 0
                    machines_data[m]['utilization_percent'] = 0

                }
            }

            // get units for every machine
            for(let x=0;x<machines_data.length;x++){

                let units_data = await demo_model.find({
                        machine_id:machines_data[x]._id,
                        timestamp:{
                            $gte:machines_data[x].starttime,
                            $lte:machines_data[x].endtime
                        },},
                    {
                        load_current:1
                    })

                if(units_data.length>=1){
                    let power = 0
                    for(let c=0;c<units_data.length;c++){

                        power = power + units_data[c].load_current * 1.732*0.95*400

                    }
                    power = power/units_data.length
                    let units = (power/1000) * duration
                    machines_data[x]['units'] = Math.round(units)
                    delete machines_data[x]['starttime']
                    delete machines_data[x]['endtime']

                }
                else {
                    machines_data[x]['units'] = 0
                }
                delete machines_data[x]['starttime']
                delete machines_data[x]['endtime']

            }

            let final_data = {
                zone_summary:{
                    humidity:humidity,
                    temperature:temperature,
                    min_humidity:min_humidity,
                    max_humidity: max_humidity,
                    min_temperature:min_temperature,
                    max_temperature: max_temperature

                },
                machines_data:machines_data
            }

            return final_data
        }
        else{

            // zone and node found. But no machine found

            let final_data = {
                zone_summary:{
                    humidity:humidity,
                    temperature:temperature,
                    min_humidity:min_humidity,
                    max_humidity: max_humidity,
                    min_temperature:min_temperature,
                    max_temperature: max_temperature
                }
            }

            return final_data
        }
    }

    async get_prev_24hrs_envData(node_id){

        let date_string = moment().tz("Asia/Karachi").format("YYYY-MM-DD")
        let date_ = moment(date_string+"T00:00:00")
        date_.subtract({ hours: 5});
        let end_date_string = date_.format("YYYY-MM-DD")

        let env_data = await environment_model.find({
                node_id:node_id,
                timestamp:{$gte:end_date_string+"T19:00:00Z",$lte:date_string+"T18:59:59Z"}
            },
            {
                _id:0,
                __v:0,

            })

        if(env_data.length==0){

            return []

        }

        // reformatting environment data into single json object by adding arrays and minimizing key value pairs.

        let temperature_array = []
        let humidity_array = []
        let temperature_alert_array = []
        let humidity_alert_array= []
        let timestamp_array = []

        for(let x=0;x<env_data.length;x++){
            temperature_array.push(env_data[x]['temperature'])
            humidity_array.push(env_data[x]['humidity'])
            temperature_alert_array.push(env_data[x]['temperature_alert'])
            humidity_alert_array.push(env_data[x]['humidity_alert'])
            timestamp_array.push(env_data[x]['timestamp'])
        }

        let reformatted_env_data = {
            node_id:node_id,
            zone_id: env_data[0].zone_id,
            temperature: temperature_array,
            humidity: humidity_array,
            temperature_alert: temperature_alert_array,
            humidity_alert:humidity_alert_array,
            timestamp:timestamp_array
        }


        return reformatted_env_data

    }

}

module.exports = new zone_service()

// let all_records = await demo_model.find({
//     machine_id:machines_data[x]._id,
//     start_time:{
//         $gte: start_time,
//         $lte: end_time
//     }
// })