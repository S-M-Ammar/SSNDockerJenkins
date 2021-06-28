let zone_service = require('../services/zone_service')

async function get_all_zones(req,res){

    try{
        let response = await zone_service.get_all_zones()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_zone(req,res){

    try{
        let id = req.params.id
        let response = await zone_service.get_one_zone(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_zone(req,res){

    try{
        let parameters = req.body
        let response = await zone_service.create_zone(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_zone(req,res){

    try{
        let update_parameters = req.body
        let response = await zone_service.update_zone(update_parameters)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_zone(req,res){
    try{
        let id = req.body.id
        let response = await zone_service.delete_zone(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function get_zone_alerts(req,res){
    try{
        let id = req.params.id
        let response = await zone_service.get_zone_alerts(id)
        if(response.length==0){
            return res.status(404).send(response)
        }
        return res.status(200).send(response)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

async function getNodes_and_Machines(req,res){
    try{
        let id = req.params.id
        let response = await zone_service.get_Nodes_Machines(id)
        if(response.length==0){
            return res.status(404).send(response)
        }
        return res.status(200).send(response)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

async function get_zone_summary(req,res){
    try{
        let id = req.params.id
        let response = await  zone_service.get_zone_summary(id)
        if(response.length>=1){
            res.status(200).send(response)
        }
        res.status(404).send(response)

    }
    catch (e) {
        res.status(500).send(e)
    }
}

async function get_zone_prev_24hrs_envData(req,res){
    try{
        let node_id = req.params.id
        let response = await zone_service.get_prev_24hrs_envData(node_id)
        if(response.length>=1){
            res.status(200).send(response)
        }
        res.status(404).send(response)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

module.exports = {get_all_zones,get_one_zone,create_zone,update_zone,delete_zone,getNodes_and_Machines,get_zone_summary,get_zone_alerts,get_zone_prev_24hrs_envData}