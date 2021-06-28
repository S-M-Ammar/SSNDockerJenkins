let machine_mapping_service = require('../services/machine_mapping_service')

async function get_all_machine_mappings(req,res){

    try{
        let response = await machine_mapping_service.get_all_machine_mappings()
        return res.status(200).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_machine_mapping(req,res){

    try{
        let id = req.params.id
        let response = await machine_mapping_service.get_one_machine_mapping(id)
        return res.status(200).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_machine_mapping(req,res){

    try{
        let parameters = req.body
        let response = await machine_mapping_service.create_machine_mapping(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_machine_mapping(req,res){

    try{
        let update_parameters = req.body
        let response = await machine_mapping_service.update_machine_mapping(update_parameters)
        return res.status(200).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_machine_mapping(req,res){
    try{
        let id = req.body.id
        let response = await machine_mapping_service.delete_machine_mapping(id)
        return res.status(200).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

module.exports = {get_all_machine_mappings,get_one_machine_mapping,create_machine_mapping,update_machine_mapping,delete_machine_mapping}
