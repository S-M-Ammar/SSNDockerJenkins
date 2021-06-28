require('./database/mongoose')
const environment_data = require('./models/environment')

const updt_ev_data = async ()=>{

    let norm_data = await environment_data.find({node_id:"5fe9fabf11e87b017cb16ad4"}).and([

        {$and:[{temperature:{$ne:0}},{humidity:{$ne:0}}]}
    ])

    let temp = []
    let humidity = []

    for(let x=0;x<norm_data.length;x++){

        temp.push(norm_data[x].temperature)
        humidity.push(norm_data[x].humidity)

    }

    let avg_temp = Math.round( eval(temp.join('+')) / temp.length)
    let avg_humd = Math.round(eval(humidity.join('+')) / humidity.length)

    console.log(avg_temp)
    console.log(avg_humd)

    let currpt_data = await environment_data.find({node_id:"5fe9fabf11e87b017cb16ad4"}).or([

        {$and:[{temperature:{$eq:0}}]},
        {$and:[{humidity:{$eq:0}}]}
    ])

    for(let x=0;x<currpt_data.length;x++){

        await environment_data.findByIdAndUpdate(currpt_data[x]._id,{temperature:avg_temp,humidity:avg_humd})

    }
    console.log("Done")

}



updt_ev_data()



