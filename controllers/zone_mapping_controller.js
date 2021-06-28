let zone_mapping_service = require('../services/zone_mapping_service')

async function get_all_zone_mappings(req,res){

    try{
        let response = await zone_mapping_service.get_all_zone_mappings()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_zone_mapping(req,res){

    try{
        let id = req.params.id
        let response = await zone_mapping_service.get_one_zone_mapping(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_zone_mapping(req,res){

    try{
        let parameters = req.body
        let response = await zone_mapping_service.create_zone_mapping(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_zone_mapping(req,res){

    try{
        let update_parameters = req.body
        let response = await zone_mapping_service.update_zone_mapping(update_parameters)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_zone_mapping(req,res){
    try{
        let id = req.body.id
        let response = await zone_mapping_service.delete_zone_mapping(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

module.exports = {get_all_zone_mappings,get_one_zone_mapping,create_zone_mapping,update_zone_mapping,delete_zone_mapping}
