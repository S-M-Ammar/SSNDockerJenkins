let machine_service = require('../services/machine_service')

async function get_all_machines(req,res){

    try{
        let response = await machine_service.get_all_machines()
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_one_machine(req,res){

    try{
        let id = req.params.id
        let response = await machine_service.get_one_machine(id)
        if(response.length>=1){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function create_machine(req,res){

    try{
        let parameters = req.body
        let response = await machine_service.create_machine(parameters)
        return res.status(201).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }

}

async function get_machine_utilization(req,res){

    try{
        let parameters = req.body
        if(!("duration" in parameters)){
            return res.status(500).send("Duration not provided")
        }
        else if(!("timestamp") in parameters){
            return res.status(500).send("Timestamp not provided")
        }
        else if(!("id") in parameters){
            return res.status(500).send("Id not provided")
        }
        else{
            let response = await machine_service.get_machine_utilization(parameters)
            if(response!="No machine found"){
                return res.status(200).send(response)
            }
            return res.status(404).send(response)
        }
    }
    catch (e){
        console.log(e)
        res.status(500).send(e)
    }
}

async function update_machine(req,res){

    try{
        let update_parameters = req.body
        let response = await machine_service.update_machine(update_parameters)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){

        res.status(500).send(e)
    }
}

async function delete_machine(req,res){
    try{
        let id = req.body.id
        let response = await machine_service.delete_machine(id)
        if(response!==null){
            return res.status(200).send(response)
        }
        return res.status(404).send(response)
    }
    catch (e){
        res.status(500).send(e)
    }
}

async function add_machine_service_time(req,res){

    try{
        let response = await machine_service.add_service_time(req.body)
        return res.status(200).send(response)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
}

async function update_machine_maintenance_history(req,res){

    try{
        let response = await machine_service.update_machine_maintenance_history(req.body)
        if(response!==null){
            res.status(200).send(response)
        }
        res.status(404).send(response)

    }
    catch (e) {
        res.status(500).send(e)
    }

}

async function get_config_for_maintenance(req,res){

    try{
        let response = await machine_service.get_config_for_maintenance(req.params.id)
        if(response!==null){
            res.status(200).send(response)
        }
        res.status(404).send(response)
    }
    catch (e) {
        res.status(500).send(e)
    }
}

async function get_maintenance_due_time(req,res){
    try{
        let response = await machine_service.get_maintenance_due_time(req.params.id)
        if(response!==null){
            res.status(404).send(response)
        }
        res.status(200).send(response)
    }
    catch (e) {
        res.status(500).send(e)
    }
}


module.exports = {get_all_machines,get_one_machine,create_machine,update_machine,delete_machine,get_machine_utilization,add_machine_service_time,update_machine_maintenance_history,get_config_for_maintenance,get_maintenance_due_time}