let demo_service = require('../services/demo_service')

async function send_data(req,res){

    try{
        let response = await demo_service.send_data(req.params.id)
        if(response.length==0){
            return res.status(404).send(response)
        }
        return res.status(200).send(response)
    }
    catch (e){
        console.log(e)
        res.status(500).send(e)
    }

}

module.exports ={send_data}