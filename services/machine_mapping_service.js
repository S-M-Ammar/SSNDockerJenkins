let machine_mapping = require('../models/machine_mapping')
let node_model = require('../models/node')
let configuration_service = require('../services/configuration_service')


class machine_mapping_service{

    async get_all_machine_mappings(){

        return await machine_mapping.find({})
    }

    async get_one_machine_mapping(id){

        return await machine_mapping.find({_id:id})
    }

    async create_machine_mapping(parameters){

        let _machine_mapping = machine_mapping(parameters)
        let node_check = await machine_mapping.find({node_id:parameters.node_id})
        if(node_check.length<2){
            let sensor_numbers = []
            for(let i=0;i<node_check.length;i++){

                if(parameters.machine_id==node_check[i].machine_id){
                    return ("Machine already mapped with node.")
                }
                else{
                    sensor_numbers.push(node_check[i].sensor_number)
                    if(sensor_numbers.includes(parameters.sensor_number)){
                        return ("Sensor number already assigned")
                    }
                }
            }

            let res = await _machine_mapping.save()

            configuration_service.send_configuration_message(parameters).then((result)=>{
                console.log(result)
            }).catch((error)=>{
                console.log(error)
            })
            return res
        }
        else {
            return ("Cant add more than 2 machines with node")
        }
    }

    async update_machine_mapping(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id
        let response_ = await this.get_one_machine_mapping(id)
        let node_id = response_[0].node_id
        let params = {node_id:node_id}

        if("node_id" in update_parameters){

            let node_check_response  = await machine_mapping.find({node_id:update_parameters.node_id})
            if(node_check_response.length==2){
                return "2 machines are already attached with node."
            }

        }
        if("machine_id" in update_parameters){
            let machine_check_response = await machine_mapping.find({machine_id:update_parameters.machine_id})
            if(machine_check_response.length>=1){
                return "Machine is already attached with some other node."

            }
        }
        if("sensor_number" in update_parameters){

            let check_nodes_with_machine_sensor = await machine_mapping.find({node_id:node_id})
            if(check_nodes_with_machine_sensor.length>=1){

                for(let i=0;i<check_nodes_with_machine_sensor.length;i++){

                    if(check_nodes_with_machine_sensor[i]._id!=id){

                        if(check_nodes_with_machine_sensor[i].sensor_number==update_parameters.sensor_number){
                            return "sensor number is already assigned"
                        }
                    }

                }

            }

        }

        let res = await machine_mapping.findByIdAndUpdate(id,update_parameters)

        configuration_service.send_configuration_message(params).then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })

        return res
    }

    async delete_machine_mapping(id){
        return await machine_mapping.findByIdAndDelete(id)
    }

    async get_mac_and_sensor_against_machine(id){

       return new Promise((async (resolve, reject) => {

           try{
               let machine_mapping_instance = await machine_mapping.find({machine_id:id})
               if(machine_mapping_instance.length>=1){
                   let machine_sensor = machine_mapping_instance[0].sensor_number

                   let node_response = await node_model.find({_id:machine_mapping_instance[0].node_id})

                   if(node_response.length>=1){

                       let mac = node_response[0].mac
                       resolve({mac:mac,sensor_number:machine_sensor})
                   }
                   reject( "")
               }
               reject("")
           }
           catch (e) {
               reject("Unknown error occured while fetching node mac and sensor number against machine id")
           }

       }))
    }
}

module.exports = new machine_mapping_service()