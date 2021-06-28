require('./database/mongoose')
const demo_model = require('./models/demo_model')

// demo_model.find({"node_id" : "70:B3:D5:FE:4C:F1"}).distinct('ssn_uptime').then((results)=>{
// demo_model.distinct('ssn_uptime').then((res)=>{
//     console.log(res)
// }).catch((e)=>{
//     console.log(e)
// })

const getData = async ()=>{
    const res  = await demo_model.find({node_id:"70:b3:d5:fe:4d:7a"}).distinct('ssn_uptime')
    for(let x=0;x< res.length;x++){
        console.log(res[x]+5)
    }
}

getData()