require('./database/mongoose')
const moment = require('moment-timezone')
const live_alerts_model = require('./models/live_alerts_model')

// const moment = require('moment-timezone')

// const environment_model = require('./models/environment')
//
// const func = async ()=>{
//
//     const res = await environment_model.find({node_id:"600fad6f549c501670d9880b"}).sort({_id:-1}).limit(1)
//     console.log(res)
//
// }
//
// func()

//
// const demo_model = require('./models/demo_model')
// const getData = async ()=>{
//     const res  = await demo_model.find({node_id:"70:B3:D5:FE:4C:F1"})
//     let ssn_uptime;
//     for(let x=0;x<res.length;x++){
//         if(x==0){
//             ssn_uptime = res[x].ssn_uptime.toString()
//             console.log(res[x].ssn_uptime)
//             console.log(res[x].machine_state_duration)
//             console.log("\n\n")
//         }
//         else if(ssn_uptime!==res[x].ssn_uptime.toString()){
//             ssn_uptime = res[x].ssn_uptime.toString()
//             console.log(res[x].ssn_uptime)
//             console.log(res[x].machine_state_duration)
//             console.log("\n\n")
//         }
//     }
// }
//
// getData()
//
// let new_alert_record = new live_alerts_model({
//     zone_id:"6045d7e8eb512924e8de5485",
//     node_id:"6045eedd1b2d331884b42ba0",
//     alert_type:"temperature_max_threshold",
//     parameter_value:0,
//     start_time:moment().toDate(),
//     end_time:moment().toDate(),
//     stop_flag:false,
//     timestamp:moment().toDate()
// })

// live_alerts_model.find({alert_type:"temperature_max_threshold",zone_id:"6045d7e8eb512924e8de5485",node_id:"6045eedd1b2d331884b42ba0"}).sort({_id:-1}).limit(1).then((r)=>{
//     console.log(r)
// }).catch((e)=>{
//     console.log(e)
// })

// console.log(moment().toDate())
//
// let jj = {
//     "ammar":1
// }
// console.log(Object.keys(jj).length)

// x = moment().toDate()
// console.log(x.getTime())

console.log(moment().toDate())
// new Date()