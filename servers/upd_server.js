let dgram = require('dgram')
let info = require('./machine_address')
let udp_server = dgram.createSocket('udp4')
let communication = require('../utils/communicate').communication
let utils = require('../utils/utils')
let node_service = require('../services/node_service')
let decipher = require('../utils/parser')

udp_server.bind(info.server_node_port,info.ip_address,()=>{
    console.log("Server is up at port "+info.server_node_port+"\n\n")
})

let unregistered_nodes = {}

udp_server.on('message',async (msg,rinfo)=>{

    // Handling all communications for IOT_NODE
    communication(udp_server,msg,rinfo).then((result)=>console.log(result)).catch((e)=>console.log(e))


    // collecting all nodes that are active in current network.
    let mac = utils.get_MAC_id_from_bytes(msg[0],msg[1],msg[2],msg[3],msg[4],msg[5]).toString()
    let check_flag = await node_service.check_node_by_mac(mac) // return true or false
    if(check_flag==false){
        unregistered_nodes[mac] = msg[6]
        console.log(rinfo.address + "   ===>  "+mac)
    }
    else{

        if(mac in unregistered_nodes){

            delete unregistered_nodes[mac]
        }
    }

})


module.exports = {udp_server,unregistered_nodes}