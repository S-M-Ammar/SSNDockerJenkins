let io = require('../servers/express_server').io
let client = require('../servers/mqtt_server').client
let machine_mapping_service = require('../services/machine_mapping_service')
let decipher_message = require('../utils/parser')
let send_demo_data = require('../utils/utils').send_demo_data
let clients_dict = {}

io.on("connection",(socket)=>{

    socket.on('send-data-demo-machine',(protocol)=>{
        client.on('message',(topic,msg)=>{
            clients_dict[socket.handshake.headers.host] = protocol._id.toString()
            machine_mapping_service.get_mac_and_sensor_against_machine(protocol._id).then((result)=>{
                let params = decipher_message(msg)
                if(params.node_id==result.mac){
                    if(params.node_id==result.mac){
                        try{
                            send_demo_data(socket,1,protocol,params)
                        }
                        catch (e) {

                            socket.emit('data-demo-machine-'+protocol._id,{"Error":"Cant send data"})
                            console.log(e)
                            console.log("cant send machine sensor-1 demo data. Error")

                        }

                    }
                    else{
                        try{
                            send_demo_data(socket,2,protocol,params)
                        }
                        catch (e) {

                            socket.emit('data-demo-machine-'+protocol._id,{"Error":"Cant send data"})
                            console.log(e)
                            console.log("cant send machine sensor-1 demo data. Error")

                        }

                    }
                }
            }).catch((er)=>{
                console.log(er)
            })
        })
    })
})



