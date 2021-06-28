let utils = require('../utils/utils')
let decipher_message = require('../utils/parser')
let moment = require('moment-timezone')
let node_service = require('../services/node_service')
let environment_service = require('../services/environment_service')
let current_service = require('../services/current_service')
let configuration_service = require('../services/configuration_service')
let node_model = require('../models/node')
let port_number = require('../servers/machine_address').server_node_port

let mac_bytes_dict = {}

let update_node_ip = async (msg,rinfo)=>{

    return new Promise((async (resolve, reject) => {

        try{
            let params = decipher_message(msg)
            mac_bytes_dict[params.node_id] = [msg[0],msg[1],msg[2],msg[3],msg[4],msg[5]]
            let node_id = await node_service.get_node_id(params.node_id)
            if(node_id!==""){
                await node_service.update_ip({id:node_id,ip:rinfo.address.toString()})
                resolve("IP updated")
            }
            resolve("node not found in database")

        }
        catch (e){
            reject("Failed to update IP")
        }

    }))
}


let send_configuration = async (msg)=>{

    let params = decipher_message(msg)
    let node_response =  await node_model.find({mac:params.node_id})
    if(node_response.length>=1){
        let node_id = node_response[0]._id
        return await configuration_service.send_configuration_message({node_id:node_id})
    }
    else {
        return "No node found for configuration"
    }


}

let send_time_of_day_message = async (udp_server,msg,rinfo)=>{
    return new Promise(((resolve, reject) => {

        try {
            let time_value = moment().toDate().valueOf()
            time_value = parseInt(time_value/1000)
            let bytes_tick = utils.get_bytes_from_int(time_value)

            // send time of day message with mac address
            let message = Buffer.from([msg[0],msg[1],msg[2],msg[3],msg[4],msg[5],4,bytes_tick[0],bytes_tick[1],bytes_tick[2],bytes_tick[3]])

            // send time of day message without mac address
            //let message = Buffer.from([4,bytes_tick[0],bytes_tick[1],bytes_tick[2],bytes_tick[3]])

            udp_server.send(message,0,message.length,port_number,rinfo.address,()=>{
                resolve("Time of day message has been sent.\n")
            })
        }
        catch (e) {
            reject("Error while sending time of day message")
        }

    }))

}


let read_status_message = async (msg)=>{

    return new Promise((async (resolve, reject) => {

        try{
            let params = decipher_message(msg)
            let node_id = await node_service.get_node_id(params.node_id)
            if(node_id!==""){
                console.log(await environment_service.store_environment_data(params,node_id))
                console.log(await current_service.store_current_data(params,node_id))
            }
            else {
                resolve("node not found in database")
            }
        }
        catch (e){
            reject("Unable to read status message")
        }

    }))
}


let communication = async (udpserver,msg,rinfo)=>{

    console.log(await update_node_ip(msg,rinfo))

    if(msg[6]==3){

        return await send_time_of_day_message(udpserver,msg,rinfo)
    }
    if(msg[6]==5){

        return await send_configuration(msg)
    }
    if(msg[6]==8){

        return await read_status_message(msg)

    }

}

module.exports = {communication,update_node_ip,mac_bytes_dict}