let io = require('socket.io-client');

let client = io('http://192.168.0.160:3000', {
    // WARNING: in that case, there is no fallback to long-polling
    transports: [ 'websocket' ] // or [ 'websocket', 'polling' ], which is the same thing
})

client.emit('send-data-demo-machine',{_id:"60d4308690a7f02044812b0b"})


client.on('data-demo-machine-60d4308690a7f02044812b0b',(parseJSON)=>{

    try{
        console.log(parseJSON)
    }
    catch (e){

    }
})
