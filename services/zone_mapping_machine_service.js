let zone_mapping_machine = require('../models/zone_mapping_machine')
let machine_model = require('../models/machine')
let zone_model = require('../models/zone')

class zone_mapping_machine_service{

    async get_all_zone_mapping_machines(){

        return await zone_mapping_machine.find({})
    }

    async get_one_zone_mapping_machine(id){

        return await zone_mapping_machine.find({_id:id})
    }

    async create_zone_mapping_machine(parameters){

        let _zone_mapping_machine = zone_mapping_machine(parameters)

        let zone_model_response = await zone_model.find({_id:parameters.zone_id})
        if(zone_model_response.length==0){

            return new Error("Zone does not exist")
        }

        let machine_model_response = await machine_model.find({_id:parameters.machine_id})
        if(machine_model_response.length==0){

            return new Error("Machine does not exist")
        }
        let zone_mapping_machine_response = await zone_mapping_machine.find({machine_id:parameters.machine_id})
        if(zone_mapping_machine_response.length>=1){

            return new Error("Machine already mapped with other zone")

        }

        return await _zone_mapping_machine.save()
    }


    async update_zone_mapping_machine(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id
        if("zone_id" in update_parameters){
            let zone_model_response = await zone_model.find({_id:update_parameters.zone_id})
            if(zone_model_response.length==0){

                return new Error("Zone does not exist")
            }
        }

        if("machine_id" in update_parameters){

            let machine_model_response = await machine_model.find({_id:update_parameters.machine_id})
            if(machine_model_response.length==0){

                return new Error("Machine does not exist")
            }
            let zone_mapping_machine_response = await zone_mapping_machine.find({machine_id:update_parameters.machine_id})
            if(zone_mapping_machine_response.length>=1){

                return new Error("Machine already mapped with other zone")

            }

        }

        return await zone_mapping_machine.findByIdAndUpdate(id,update_parameters)
    }

    async delete_zone_mapping_machine(id){
        return await zone_mapping_machine.findByIdAndDelete(id)
    }
}

module.exports = new zone_mapping_machine_service()