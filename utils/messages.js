let SSN_MessageType_to_ID = {
    'GET_MAC':               "1",
    'SET_MAC':               "2",
    'GET_TIMEOFDAY':         "3",
    'SET_TIMEOFDAY':         "4",
    'GET_CONFIG':            "5",
    'SET_CONFIG':            "6",
    'ACK_CONFIG':            "7",
    'STATUS_UPDATE':         "8",
    'RESET_MACHINE_TIME':    "9",
    'DEBUG_EEPROM_CLEAR':   "10",
    'DEBUG_RESET_SSN':      "11"
}

let SSN_MessageID_to_TYPE = {
    "1":  'GET_MAC',
    "2":  'SET_MAC',
    "3":  'GET_TIMEOFDAY',
    "4":  'SET_TIMEOFDAY',
    "5":  'GET_CONFIG',
    "6":  'SET_CONFIG',
    "7":  'ACK_CONFIG',
    "8":  'STATUS_UPDATE',
    "9":  'RESET_MACHINE_TIME',
    "10": 'DEBUG_EEPROM_CLEAR',
    "11": 'DEBUG_RESET_SSN'
}

let SSN_Message_Sizes = {
    'GET_MAC':               3,
    'SET_MAC':               7,
    'GET_TIMEOFDAY':         3,
    'SET_TIMEOFDAY':         5,
    'GET_CONFIG':            3,
    'SET_CONFIG':            "6",
    'ACK_CONFIG':            "7",
    'STATUS_UPDATE':         60,
    'RESET_MACHINE_TIME':    "9",
    'DEBUG_EEPROM_CLEAR':   "10",
    'DEBUG_RESET_SSN':      "11"
}

let Activity_ID_to_TYPE = {
    "0": "NORMAL",
    "1": "ABNORMAL",
    "2": "Temperature Sensor Read Error Condition",
    "3": "Temperature Sensor CRC Error Condition",

}

let State_ID_to_TYPE = {
    "0": "OFF",
    "1": "IDLE",
    "2": "ON"
}

// let letruct_set_mac_message = (mac_address) => {
//     let buffer = new Uint8ClampedArray()
//     mac_address_in_bytes = get_mac_bytes_from_mac_string(mac_address=mac_address)
//     set_mac_message = [SSN_MessageType_to_ID['SET_MAC'], *mac_address_in_bytes]
//     return bytearray(set_mac_message)
// }

module.exports = {

    SSN_MessageType_to_ID: SSN_MessageType_to_ID,
    SSN_MessageID_to_TYPE: SSN_MessageID_to_TYPE,
    Activity_ID_to_TYPE: Activity_ID_to_TYPE,
    State_ID_to_TYPE: State_ID_to_TYPE
}