let utils = require('../utils/utils')
let node_service = require('../services/node_service')
var mqtt = require('mqtt')
// var client  = mqtt.connect('mqtt://34.87.92.5:1883',{will:{}})
var client  = mqtt.connect('mqtt://34.87.92.5:1883',{clientId:"LOCAL STAGING BACKEND SERVER"})
client.options.queueQoSZero = true
let comunicate_mqtt = require('../utils/comunicate_mqtt').communication_mqtt

let unregistered_nodes = {}
// http://www.steves-internet-guide.com/using-node-mqtt-client/

client.on('connect', function () {
    client.subscribe('StatusUpdates',{qos:1},function (err) {
        if (!err) {
            // client.publish('presence', 'Hello mqtt')
            console.log("server subscribed to status update topic")

        }
    })

    client.subscribe('Getters', {qos:1},function (err) {
        if (!err) {
            // client.publish('presence', 'Hello mqtt')
            console.log("server subscribed to getters topic")
        }
    })


})

client.on('message', async (topic, message)=>{
    // console.log(topic)
    // console.log(message)
    let mac = utils.get_MAC_id_from_bytes(message[0],message[1],message[2],message[3],message[4],message[5]).toString()
    comunicate_mqtt(topic,message,client).then((result)=>console.log(result)).catch((e)=>console.log(e))
    console.log("\n\n")
    let check_flag = await node_service.check_node_by_mac(mac) // return true or false
    if(check_flag==false){
        unregistered_nodes[mac] = message[6]
        console.log("***STATIC IP***" + "   ===>  "+mac)
    }
    else{

        if(mac in unregistered_nodes){

            delete unregistered_nodes[mac]
        }
    }
})

module.exports = {client,unregistered_nodes}
