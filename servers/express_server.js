let info = require('./machine_address')
let express = require('express')
let app = express()
let socketio = require('socket.io')
let http = require('http')
let server = http.createServer(app)
let io = socketio(server)


// io.on("connection",(socket)=>{
//
//     socket.on('send-data',(msg)=>{
//         console.log(msg)
//         socket.emit("data-"+msg._id,"here is your packet")
//     })
// })

server.listen(info.server_client_port,info.ip_address.toString(),()=>{
    console.log('Server is up on port '+info.server_client_port)
})

app.use(express.json())

module.exports = {
    app,
    io,
}
