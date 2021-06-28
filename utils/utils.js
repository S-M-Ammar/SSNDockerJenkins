let isEqual = require('is-equal');

let get_MAC_id_from_bytes = (high_byte,byte_1,byte_2,byte_3,byte_4,low_byte) => {

    let b_1 = high_byte.toString(16).toString()
    let b_2 = byte_1.toString(16).toString()
    let b_3 = byte_2.toString(16).toString()
    let b_4 = byte_3.toString(16).toString()
    let b_5 = byte_4.toString(16).toString()
    let b_6 = low_byte.toString(16).toString()

    if(b_1.length==1){
        b_1 = "0"+b_1
    }
    if(b_2.length==1){
        b_2 = "0"+b_2
    }
    if(b_3.length==1){
        b_3 = "0"+b_3
    }
    if(b_4.length==1){
        b_4 = "0"+b_4
    }
    if(b_5.length==1){
        b_5 = "0"+b_5
    }
    if(b_6.length==1){
        b_6 = "0"+b_6
    }
    let final_mac = b_1+":"+b_2+":"+b_3+":"+b_4+":"+b_5+":"+b_6
    return(final_mac.toLowerCase())

};

let get_word_from_bytes = (high_byte, low_byte) => {
    return (high_byte << 8) | low_byte;
};

let get_int_from_bytes = (highest_byte, higher_byte, high_byte, low_byte) => {
    return (
        (highest_byte << 24) | (higher_byte << 16) | (high_byte << 8) | low_byte
    );
};

let get_bytes_from_int = (this_int) => {
    let B1 = (this_int & 0xff000000) >> 24;
    let B2 = (this_int & 0x00ff0000) >> 16;
    let B3 = (this_int & 0x0000ff00) >> 8;
    let B4 = this_int & 0x000000ff;
    return [B1, B2, B3, B4];
};

let get_mac_bytes_from_mac_string = (mac_address)=>{

    let mac_in_bytes = []
    for(let i=0;i<18;i=i+3){
        mac_in_bytes.push(parseInt(mac_address.slice(i,i+2),16))
    }
    return mac_in_bytes

}

let isEqual_configuration = (config_1,config_2)=>{

    return new Promise(((resolve, reject) => {

        try{

            let array_1 = Object.entries(config_1).slice(0,13).map(entry => entry[1])
            array_1  = Object.entries(array_1[5]).slice(0,13).map(entry => entry[1])
            array_1.push(config_1.MAC)
            let array_2 = Object.entries(config_2).slice(0,13).map(entry => entry[1])
            array_2  = Object.entries(array_2[5]).slice(0,13).map(entry => entry[1])
            array_2.push(config_2.MAC)

            if(isEqual(array_1,array_2)){
                resolve( true)
            }
            resolve (false)
        }
        catch (e) {
            reject("Error while comparing two configuration objects.")
        }

    }))


}

let convert_config_to_array = (config)=>{

    return new Promise((resolve, reject)=>{

        try {
            let array_config = [6,config.Machine_1_Sensor_Rating,config.Machine_1_Threshold,config.Machine_1_Max_Load,
                config.Machine_2_Sensor_Rating,config.Machine_2_Threshold,config.Machine_2_Max_Load,
                config.Machine_3_Sensor_Rating,config.Machine_3_Threshold,config.Machine_3_Max_Load,
                config.Machine_4_Sensor_Rating,config.Machine_4_Threshold,config.Machine_4_Max_Load,
                config.Reporting_Interval]

            resolve(array_config)
        }
        catch (e) {
            reject("Error while converting configuration into array")
        }

    })

}

let send_demo_data = (socket,sensor_number,protocol,params)=>{

    socket.emit('data-demo-machine-'+protocol._id, {
        "message_id":params.message_id,
        "node_id" : params.node_id,
        "temperature":params.temperature,
        "humidity":params.humidity,
        "ssn_uptime": params.ssn_uptime,
        "abnormal_activity": params.abnormal_activity,
        "machine_id":protocol._id,
        "load_current":params.machine_load_currents[sensor_number],
        "status":params.machine_status[sensor_number],
        "load_current_percentage":params.machine_load_percentages[sensor_number],
        "machine_state_timestamp":params.machine_state_timestamp[sensor_number],
        "machine_state_duration":params.machine_state_duration[sensor_number],
        "timestamp":params.timestamp
    })

}

module.exports = {
    get_MAC_id_from_bytes,
    get_word_from_bytes,
    get_int_from_bytes,
    get_bytes_from_int,
    get_mac_bytes_from_mac_string,
    isEqual_configuration,
    convert_config_to_array,
    send_demo_data
};