let io = require('socket.io-client');

let client = io('http://192.168.0.160:3001', {
    // WARNING: in that case, there is no fallback to long-polling
    transports: [ 'websocket' ] // or [ 'websocket', 'polling' ], which is the same thing
})

client.emit('send-data-environment',{_id:"604893875e31ef15f4e43cdd"})
// client.on('data',(msg)=>{
//     console.log(msg)
// })
client.on('data-environment-604893875e31ef15f4e43cdd',(parseJSON)=>{

    try{
        console.log(parseJSON)
    }
    catch (e){

    }
})
