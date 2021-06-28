let ip = require('ip');

// Get your ip address
let ip_address = ip.address().toString()
let server_client_port = 3000 
let server_node_port = 9999 

module.exports={
    ip_address,
    server_client_port,
    server_node_port
}