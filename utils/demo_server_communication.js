let io = require('../servers/express_server').io
let udp_server = require('../servers/upd_server').udp_server
let machine_mapping_service = require('../services/machine_mapping_service')
let decipher_message = require('../utils/parser')
let send_demo_data = require('../utils/utils').send_demo_data
let clients_dict = {}

io.on("connection",(socket)=>{

    socket.on('send-data-demo-machine',(protocol)=>{
        udp_server.on('message',(msg,rinfo)=>{
            clients_dict[socket.handshake.headers.host] = protocol._id.toString()
            machine_mapping_service.get_mac_and_sensor_against_machine(protocol._id).then((result)=>{
                let params = decipher_message(msg)
                if(params.node_id==result.mac){
                    if(result.sensor_number==1){
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
                            console.log("cant send machine sensor-2 demo data. Error")
                        }

                    }
                }
            }).catch((er)=>{
                socket.emit('data-demo-machine-'+protocol._id,{"Error":"Cant send data"})
                console.log(er)
            })
        })
    })
})



