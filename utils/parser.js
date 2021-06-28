let messages = require('../utils/messages')
let utils = require('../utils/utils')
let moment = require('moment-timezone')

let SSN_MessageTYPE_to_ID = messages.SSN_MessageTYPE_to_ID
let SSN_MessageID_to_TYPE = messages.SSN_MessageID_to_TYPE
let Activity_ID_to_TYPE = messages.Activity_ID_to_TYPE
let State_ID_to_TYPE = messages.State_ID_to_TYPE

let decipher_message = (node_message) => {
    // console.log(node_message[4])
    message_id = node_message[6].toString()
    node_id = utils.get_MAC_id_from_bytes(node_message[0],node_message[1],node_message[2],node_message[3],node_message[4],node_message[5])
    // console.log(message_id)
    if (SSN_MessageID_to_TYPE[message_id] === "STATUS_UPDATE") {
        let x = 3;
        let temperature = utils.get_word_from_bytes(node_message[7], node_message[8])/10.0
        let humidity = utils.get_word_from_bytes(node_message[9], node_message[10])/10.0
        let state_flags = node_message[11];
        let ssn_uptime = utils.get_int_from_bytes(node_message[60], node_message[61], node_message[62], node_message[63])
        let abnormal_activity = Activity_ID_to_TYPE[node_message[64].toString()]
        // console.log("Testing received values: ", temperature, humidity)
        let machine_load_currents = [], machine_load_percentages = [], machine_status = [], machine_state_timestamp = [], machine_state_duration = []
        let offset = 12
        for (let i=0; i<4; i++) {
            machine_load_currents.push(utils.get_word_from_bytes(node_message[12+i*offset], node_message[13+i*offset])/100.0)
            machine_load_percentages.push(node_message[14+i*offset])
            machine_status.push(State_ID_to_TYPE[node_message[15+i*offset].toString()])
            machine_state_timestamp.push(utils.get_int_from_bytes(node_message[16+i*offset], node_message[17+i*offset],
                node_message[18+i*offset], node_message[19+i*offset]))
            machine_state_duration.push(utils.get_int_from_bytes(node_message[20+i*offset], node_message[21+i*offset],
                node_message[22+i*offset], node_message[23+i*offset]))
        }

        return {
            message_id: message_id,
            node_id: node_id,
            temperature: temperature,
            humidity: humidity,
            ssn_uptime: moment(ssn_uptime*1000).toDate(),
            abnormal_activity: abnormal_activity,
            machine_load_currents: machine_load_currents,
            machine_load_percentages: machine_load_percentages,
            machine_status: machine_status,
            machine_state_timestamp: [moment(machine_state_timestamp[0]*1000).toDate(),moment(machine_state_timestamp[1]*1000).toDate()],
            machine_state_duration: machine_state_duration,
            timestamp:moment().toDate()
        }
    }
    return {
        message_id: message_id,
        node_id: node_id
    }
}

module.exports =  decipher_message