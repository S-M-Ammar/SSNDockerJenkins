let zone_mapping_machine_service = require('../services/zone_mapping_machine_service')


async function get_all_zone_mapping_machines(req,res){

    try{
        let response = await zone_mapping_machine_service.get_all_zone_mapping_machines()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_zone_mapping_machine(req,res){

    try{
        let id = req.params.id
        let response = await zone_mapping_machine_service.get_one_zone_mapping_machine(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_zone_mapping_machine(req,res){

    try{
        let parameters = req.body
        let response = await zone_mapping_machine_service.create_zone_mapping_machine(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_zone_mapping_machine(req,res){

    try{
        let update_parameters = req.body
        let response = await zone_mapping_machine_service.update_zone_mapping_machine(update_parameters)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_zone_mapping_machine(req,res){
    try{
        let id = req.body.id
        let response = await zone_mapping_machine_service.delete_zone_mapping_machine(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

module.exports = {get_all_zone_mapping_machines,get_one_zone_mapping_machine,create_zone_mapping_machine,update_zone_mapping_machine,delete_zone_mapping_machine}