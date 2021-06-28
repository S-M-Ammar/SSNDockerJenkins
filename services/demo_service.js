let demo_model = require('../models/demo_model')
let moment = require('moment-timezone')

let send_data = async (machine_id)=>{

      let date_string = moment().tz("Asia/Karachi").format("YYYY-MM-DD")
      let date_ = moment(date_string+"T00:00:00")
      date_.subtract({ hours: 5});
      let end_date_string = date_.format("YYYY-MM-DD")

      //getting machine node data of given day
      let current_data = await demo_model.find({
              machine_id:machine_id,
              timestamp:{$gte:end_date_string+"T19:00:00Z",$lte:date_string+"T18:59:59Z"}
            },
            {
                _id:0,
                __v:0,
                message_id:0,
                node_id:0
            })

      if(current_data.length==0){

            return []

      }
      // reformatting current data into single json object by adding arrays and minimizing key value pairs.

      let load_current_array = []
      let load_current_percentage_array = []
      let status_array = []
      let machine_state_timestamp_array = []
      let machine_state_duration_array = []
      let temperature_array = []
      let humidity_array = []
      let ssn_uptime_array = []
      let abnormal_activity_array = []
      let timestamp_array = []

      for(let x=0;x<current_data.length;x++){
          load_current_array.push(current_data[x]['load_current'])
          load_current_percentage_array.push(current_data[x]['load_current_percentage'])
          status_array.push(current_data[x]['status'])
          machine_state_timestamp_array.push(current_data[x]['machine_state_timestamp'])
          machine_state_duration_array.push(current_data[x]['machine_state_duration'])
          temperature_array.push(current_data[x]['temperature'])
          humidity_array.push(current_data[x]['humidity'])
          ssn_uptime_array.push(current_data[x]['ssn_uptime'])
          abnormal_activity_array.push(current_data[x]['abnormal_activity'])
          timestamp_array.push(current_data[x]['timestamp'])
      }

      // console.log(load_current_percentage_array)
      // console.log(load_current_array)
      // console.log(status_array)
      // console.log(machine_state_timestamp_array)
      // console.log(machine_state_duration_array)
      // console.log(temperature_array)
      // console.log(humidity_array)
      // console.log(abnormal_activity_array)
      // console.log(timestamp_array)

      let reformatted_current_data = {
          machine_id:current_data[0]['machine_id'],
          load_current: load_current_array,
          load_current_percentage: load_current_percentage_array,
          status:status_array,
          machine_state_timestamp: machine_state_timestamp_array,
          machine_state_duration: machine_state_duration_array,
          temperature:temperature_array,
          humidity: humidity_array,
          abnormal_activity: abnormal_activity_array,
          timestamp:timestamp_array
      }


      return reformatted_current_data

}

module.exports = {send_data}


 // of that particular day,
