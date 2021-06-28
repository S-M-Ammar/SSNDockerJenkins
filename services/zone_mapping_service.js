let zone_mapping = require('../models/zone_mapping')
let node_model = require('../models/node')
let zone_model = require('../models/zone')

class zone_mapping_service{

    async get_all_zone_mappings(){

        return await zone_mapping.find({})
    }

    async get_one_zone_mapping(id){

        return await zone_mapping.find({_id:id})
    }

    async create_zone_mapping(parameters){

        let _zone_mapping = zone_mapping(parameters)
        let zone_mapping_response = await this.get_all_zone_mappings()
        if(zone_mapping_response.length>=1)
        {
            for(let i=0;i<zone_mapping_response.length;i++){

                if(zone_mapping_response[i].node_id==parameters.node_id){
                    return "Node already mapped with zone"
                }
            }
        }
        let zone_model_res = await zone_model.find({_id:parameters.zone_id})
        if(zone_model_res.length==0){
            return new Error("Zone does not exist")
        }

        let node_model_res = await node_model.find({_id:parameters.node_id})
        if(node_model_res.length==0){

            return new Error("Node does not exist")
        }

        return await _zone_mapping.save()
    }

    async update_zone_mapping(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id

        if("zone_id" in update_parameters){
            let zone_exits = await zone_model.find({_id:update_parameters.zone_id})
            if(zone_exits.length==0){
                return  new Error("Zone does not exist")
            }
        }

        if("node_id" in update_parameters){
            let node_exists = await node_model.find({_id:update_parameters.node_id})
            if(node_exists.length==0){
                return  new Error("Node does not exist")
            }

            let node_model_res = await zone_mapping.find({node_id:update_parameters.node_id})
            if(node_model_res.length>=1){
                return  new Error("Node already attached with other zone")
            }

        }
        
        return await zone_mapping.findByIdAndUpdate(id,update_parameters)
    }

    async delete_zone_mapping(id){
        return await zone_mapping.findByIdAndDelete(id)
    }

    async get_environment_data_for_zone (zone_id){

        let zone_mapping_response = await zone_mapping.find({zone_id:zone_id})
        if(zone_mapping_response.length>=1){
            let mac_list= []
            for(let i=0;i<zone_mapping_response.length;i++){
                let node_res  = await node_model.find({_id:zone_mapping_response[i].node_id})
                if(node_res.length>=1){
                    mac_list.push(node_res[0].mac)
                }

            }
            return mac_list
        }
        else {
            return []
        }
    }

}

module.exports = new zone_mapping_service()