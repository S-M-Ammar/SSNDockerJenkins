let node_model = require('../models/node')
let machine_mapping_model = require('../models/machine_mapping')
let machine_model = require('../models/machine')
let zone_mapping_model = require('../models/zone_mapping')
let zone_model = require('../models/zone')
let port_number = require('../servers/machine_address').server_node_port

let send_configuration_message = async (params)=>{

    return new Promise((async (resolve, reject) => {

        try{
            let node_ = await node_model.findOne({_id:params.node_id})

            let sensor_1_rating = 0
            let sensor_2_rating = 0
            let min_temperature = 0
            let max_temperature = 0
            let min_humidity  = 0
            let max_humidity = 0

            if(node_.length!=0)
            {
                let zone_mapping_response = await zone_mapping_model.find({node_id:params.node_id})
                if(zone_mapping_response.length!=0) {

                    let zone_ = await zone_model.find({_id: zone_mapping_response[0].zone_id})
                    if (zone_.length != 0) {
                        sensor_1_rating = node_.sensor_1_rating
                        sensor_2_rating = node_.sensor_2_rating
                        min_temperature = zone_[0].min_temperature
                        max_temperature = zone_[0].max_temperature
                        min_humidity = zone_[0].min_humidity
                        max_humidity = zone_[0].max_humidity
                    }

                }

                let ip = node_.ip
                let mac = node_.mac
                let reporting_interval = 5
                let machine_mapping_response = await machine_mapping_model.find({node_id:node_._id})
                let machine_1_max_load = 0
                let machine_1_threshold = 0
                let machine_2_max_load = 0
                let machine_2_threshold = 0
                let machine_1_voltage = 0
                let machine_2_voltage = 0
                if(machine_mapping_response.length>=1){

                    for(let k=0;k<machine_mapping_response.length;k++){

                        if(machine_mapping_response[k].sensor_number==1){
                            let machine_ = await machine_model.find({_id:machine_mapping_response[k].machine_id})

                            if(machine_.length>=1){
                                machine_1_max_load = machine_[0].max_load
                                machine_1_threshold = machine_[0].idle_threshold
                                machine_1_voltage = machine_[0].sensor_voltage_scalar
                            }
                        }

                        else if(machine_mapping_response[k].sensor_number==2){
                            let machine_ = await machine_model.find({_id:machine_mapping_response[k].machine_id})

                            if(machine_.length>=1){
                                machine_2_max_load = machine_[0].max_load
                                machine_2_threshold = machine_[0].idle_threshold
                                machine_2_voltage = machine_[0].sensor_voltage_scalar
                            }
                        }
                    }
                }

                try{
                        let udp_server = require('../servers/upd_server').udp_server
                        let mac_bytes_dict = require('../utils/communicate').mac_bytes_dict
                        let mac_bytes_dict_mqtt = require('../utils/comunicate_mqtt').mac_bytes_dict_mqtt

                        if(mac_bytes_dict_mqtt[mac]!=undefined){

                            let client = require('../servers/mqtt_server').client
                            let mac_bytes_mqtt = mac_bytes_dict_mqtt[mac]
                            let message_mqtt = Buffer.from([mac_bytes_mqtt[0],mac_bytes_mqtt[1],mac_bytes_mqtt[2],mac_bytes_mqtt[3],mac_bytes_mqtt[4],mac_bytes_mqtt[5],6,sensor_1_rating, machine_1_threshold * 10, machine_1_max_load, machine_1_voltage, sensor_2_rating, machine_2_threshold * 10, machine_2_max_load, machine_2_voltage, 0, 0, 0, 0, 0, 0, 0, 0, min_temperature,max_temperature, min_humidity, max_humidity, reporting_interval])
                            client.publish(mac.toUpperCase(),message_mqtt,{qos:1},()=>{
                                resolve("\n\nConfiguration message has been sent for mqtt\n\n")
                            })

                            return

                        }



                        let mac_bytes = mac_bytes_dict[mac]

                        // set configuration with mac address
                        let message = Buffer.from([mac_bytes[0],mac_bytes[1],mac_bytes[2],mac_bytes[3],mac_bytes[4],mac_bytes[5],6,sensor_1_rating, machine_1_threshold * 10, machine_1_max_load, machine_1_voltage, sensor_2_rating, machine_2_threshold * 10, machine_2_max_load, machine_2_voltage, 0, 0, 0, 0, 0, 0, 0, 0, min_temperature,max_temperature, min_humidity, max_humidity, reporting_interval])

                        //set configuration without mac address
                        //let message = Buffer.from([6,sensor_1_rating,machine_1_threshold,machine_1_max_load,sensor_2_rating,machine_2_threshold,machine_2_max_load,0,0,0,0,0,0,5])

                        udp_server.send(message,0,message.length,port_number,ip,()=>{
                            resolve("Configuration message has been sent for udp")
                        })
                }
                catch (e) {
                        console.log(e)
                        reject("No connection found")
                        return
                }

            }
            else {
                reject("No node found")
                return
            }
        }
        catch (e){
            console.log(e)
            reject("Error while sending configuration message to IOT-Node")
        }


    }))

}

module.exports = {send_configuration_message}