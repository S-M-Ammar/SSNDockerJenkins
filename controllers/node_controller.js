let node_service = require('../services/node_service')

async function get_unregistered_nodes(req,res){
    try{
        let response = await node_service.get_unregistered_nodes()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}


async function get_all_nodes(req,res){

    try{
        let response = await node_service.get_all_nodes()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_node(req,res){

    try{
        let id = req.params.id
        let response = await node_service.get_one_node(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_node(req,res){

    try{
        let parameters = req.body
        let response = await node_service.create_node(parameters)
        if(response=="Node with given mac already exists"){
            return res.status(400).send(response)
        }
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function update_node(req,res){

    try{
        let update_parameters = req.body
        let response = await node_service.update_node(update_parameters)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function delete_node(req,res){
    try{
        let id = req.body.id
        let response = await node_service.delete_node(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

module.exports = {get_unregistered_nodes,get_all_nodes,get_one_node,create_node,update_node,delete_node}
