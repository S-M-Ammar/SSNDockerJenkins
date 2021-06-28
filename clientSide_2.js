let io = require('socket.io-client');

let client = io('http://192.168.10.5:3001', {
    // WARNING: in that case, there is no fallback to long-polling
    transports: [ 'websocket' ] // or [ 'websocket', 'polling' ], which is the same thing
})

client.emit('send-data-machine',{_id:"5fe9b964bcf8642b68e4e47f"})
// client.on('data',(msg)=>{
//     console.log(msg)
// })
client.on('data-machine-5fe9b964bcf8642b68e4e47f',(parseJSON)=>{

    try{
        console.log(parseJSON)
    }
    catch (e){

    }
})
