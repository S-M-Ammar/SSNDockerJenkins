let workshop_service = require('../services/workshop_service')

async function get_all_workshops(req,res){

    try{
        let response = await workshop_service.get_all_workshops()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_workshop(req,res){

    try{
        let id = req.params.id
        let response = await workshop_service.get_one_workshop(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_workshop(req,res){

    try{
        let parameters = req.body
        let response = await workshop_service.create_workshop(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_workshop(req,res){

    try{
        let update_parameters = req.body
        let response = await workshop_service.update_workshop(update_parameters)
        console.log(response)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_workshop(req,res){
    try{
        let id = req.body.id
        let response = await workshop_service.delete_workshop(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}


async function get_summary_all_workshops(req,res){
    // try{
    //     let response = await workshop_service.get_summary_all_workshop()
    //     res.status(200).send(response)
    // }
    // catch (e){
    //     res.status(500).send(e)
    // }
}

module.exports = {get_all_workshops,get_one_workshop,create_workshop,update_workshop,delete_workshop,get_summary_all_workshops}