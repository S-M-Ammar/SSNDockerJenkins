let io = require('../servers/express_server').io
let udp_server = require('../servers/upd_server').udp_server
let machine_mapping_service = require('../services/machine_mapping_service')
let zone_mapping_service = require('../services/zone_mapping_service')
let zone_model  =require('../models/zone')
let decipher_message = require('../utils/parser')
// let clients_dict = {}

io.on("connection",(socket)=>{

    socket.on('send-data-machine',(protocol)=>{
        udp_server.on('message',(msg,rinfo)=>{
            // clients_dict[socket.handshake.headers.host] = protocol._id.toString()
            machine_mapping_service.get_mac_and_sensor_against_machine(protocol._id).then((result)=>{
                let params = decipher_message(msg)
                if(msg[6]==8){
                    if(params.node_id==result.mac){
                        if(result.sensor_number==1){
                            socket.emit('data-machine-'+protocol._id, {
                                machine_load_current:params.machine_load_currents[0],
                                machine_load_percentage:params.machine_load_percentages[0],
                                machine_status:params.machine_status[0],
                                machine_state_timestamp:params.machine_state_timestamp[0],
                                machine_state_duration:params.machine_state_duration[0],
                                timestamp:params.timestamp
                            })
                        }
                        else{
                            socket.emit('data-machine-'+protocol._id,{
                                    machine_load_current:params.machine_load_currents[1],
                                    machine_load_percentage:params.machine_load_percentages[1],
                                    machine_status:params.machine_status[1],
                                    machine_state_timestamp:params.machine_state_timestamp[1],
                                    machine_state_duration:params.machine_state_duration[1],
                                    timestamp:params.timestamp
                                }
                            )
                        }
                    }
                }
            }).catch((er)=>{
                console.log(er)
            })
        })
    })

    // one zone contains multiple nodes
    socket.on('send-data-environment',(protocol)=>{
        udp_server.on('message',async (msg,res)=>{
            zone_mapping_service.get_environment_data_for_zone(protocol._id).then(async (mac_list)=>{

                if(mac_list.length>=1){
                    let params = decipher_message(msg)
                    if(msg[6]==8){

                        if(mac_list.includes(params.node_id)){
                            let zone_details = await zone_model.find({_id:protocol._id})
                            let temperature_alert = 0
                            let humidity_alert = 0

                            if(params.temperature <= zone_details[0].max_temperature && params.temperature >=zone_details[0].min_temperature){
                                temperature_alert = 0
                            }
                            else {

                                if(params.temperature > zone_details[0].max_temperature){
                                    temperature_alert = 1
                                }
                                else {
                                    temperature_alert = -1
                                }

                            }

                            if(params.humidity <= zone_details[0].max_humidity && params.humidity >= zone_details[0].min_humidity){

                                humidity_alert = 0
                            }
                            else {

                                if(params.humidity > zone_details[0].max_humidity){
                                    humidity_alert = 1
                                }
                                else{
                                    humidity_alert = -1
                                }

                            }

                            socket.emit('data-environment-'+protocol._id,{

                                zone_id:protocol._id,
                                node_mac:params.node_id,
                                temperature:params.temperature,
                                humidity:params.humidity,
                                temperature_alert:temperature_alert,
                                humidity_alert:humidity_alert,
                                timestamp:params.timestamp

                            })
                        }
                    }
                }

            }).catch((error)=>{
                console.log(error)
            })

        })
    })

    //alert system for udp
    socket.on('send-alert-environment',(protocol)=>{
        udp_server.on('message',async (msg,res)=>{
            zone_mapping_service.get_environment_data_for_zone(protocol._id).then(async (mac_list)=>{

                if(mac_list.length>=1){
                    let params = decipher_message(msg)
                    if(msg[6]==8){

                        if(mac_list.includes(params.node_id)){


                            let zone_details = await zone_model.find({_id:protocol._id})
                            let temperature_alert = 0
                            let humidity_alert = 0

                            if(params.temperature <= zone_details[0].max_temperature && params.temperature >=zone_details[0].min_temperature){
                                temperature_alert = 0
                            }
                            else {

                                if(params.temperature > zone_details[0].max_temperature){
                                    temperature_alert = 1
                                }
                                else {
                                    temperature_alert = -1
                                }

                            }

                            if(params.humidity <= zone_details[0].max_humidity && params.humidity >= zone_details[0].min_humidity){

                                humidity_alert = 0
                            }
                            else {

                                if(params.humidity > zone_details[0].max_humidity){
                                    humidity_alert = 1
                                }
                                else{
                                    humidity_alert = -1
                                }

                            }

                            // send data

                            // default structure //
                            let node_id = await node_service.get_node_id(params.node_id)
                            let alert_data = {
                                zone_id:protocol._id,
                                node_mac:params.node_id,
                                alerts:[]
                            }

                            if(temperature_alert==1){

                                let temp_data = await alert_model.find({zone_id:protocol._id,node_id:node_id,alert_type:'temperature',alert_level:1,stop_flag:false}).sort({_id:-1}).limit(1)
                                if(temp_data.length==1){
                                    alert_data['alerts'].push({
                                        alert_type:"temperature",
                                        alert_level:1,
                                        parameter_value:params.temperature,
                                        duration:(temp_data[0].end_time - temp_data[0].start_time)/1000,
                                        timestamp:params.timestamp
                                    })
                                }
                            }
                            else if(temperature_alert==-1){

                                let temp_data = await alert_model.find({zone_id:protocol._id,node_id:node_id,alert_type:'temperature',alert_level:-1,stop_flag:false}).sort({_id:-1}).limit(1)
                                if(temp_data.length==1){
                                    alert_data['alerts'].push({
                                        alert_type:"temperature",
                                        alert_level:-1,
                                        parameter_value:params.temperature,
                                        duration:(temp_data[0].end_time - temp_data[0].start_time)/1000,
                                        timestamp:params.timestamp
                                    })
                                }

                            }

                            if(humidity_alert==1){

                                let humd_data = await alert_model.find({zone_id:protocol._id,node_id:node_id,alert_type:'humidity',alert_level:1,stop_flag:false}).sort({_id:-1}).limit(1)
                                if(humd_data.length==1){
                                    alert_data['alerts'].push({
                                        alert_type:"humidity",
                                        alert_level:1,
                                        parameter_value:params.humidity,
                                        duration:(humd_data[0].end_time - humd_data[0].start_time)/1000,
                                        timestamp:params.timestamp
                                    })
                                }
                            }
                            else if(humidity_alert==-1){

                                let humd_data = await alert_model.find({zone_id:protocol._id,node_id:node_id,alert_type:'humidity',alert_level:-1,stop_flag:false}).sort({_id:-1}).limit(1)
                                if(humd_data.length==1){
                                    alert_data['alerts'].push({
                                        alert_type:"humidity",
                                        alert_level:-1,
                                        parameter_value:params.humidity,
                                        duration:(humd_data[0].end_time - humd_data[0].start_time)/1000,
                                        timestamp:params.timestamp
                                    })
                                }

                            }

                            socket.emit('data-alert-'+protocol._id,alert_data)

                        }
                    }
                }

            }).catch((error)=>{
                console.log(error)
            })

        })
    })


})