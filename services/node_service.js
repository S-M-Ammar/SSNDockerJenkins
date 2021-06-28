let node = require('../models/node')
let configuration_service = require('../services/configuration_service')
let machine_mapping_model = require('../models/machine_mapping')
let zone_mapping_model = require('../models/zone_mapping')

class node_service {

    async get_unregistered_nodes() {
        return new Promise(((resolve, reject) => {
            try {
                let udp_dict = require('../servers/upd_server').unregistered_nodes
                let mqtt_dict = require('../servers/mqtt_server').unregistered_nodes
                let unregisterNodes = Object.assign({}, udp_dict, mqtt_dict)
                resolve(unregisterNodes)
            } catch (e) {
                reject("Error while collecting unregistered nodes")
            }
        }))
    }

    async get_all_nodes() {

        return await node.find({})
    }

    async get_one_node(id) {

        return await node.find({_id: id})
    }

    async create_node(parameters) {

        let _node = node(parameters)
        let check_flag = await this.check_node_by_mac(parameters.mac)
        if (check_flag == false) {
            return await _node.save()
        }
        return "Node with given mac already exists"

    }

    async update_node(update_parameters) {

        let id = update_parameters.id
        delete update_parameters.id
        let params = {node_id: id}
        let res = await node.findByIdAndUpdate(id, update_parameters)
        configuration_service.send_configuration_message(params).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })
        return res
    }

    async update_ip(update_parameters) {

        let id = update_parameters.id
        delete update_parameters.id
        return await node.findByIdAndUpdate(id, update_parameters)
    }

    async delete_node(id) {
        let node_machine_mapping_response = await machine_mapping_model.find({node_id: id})
        if (node_machine_mapping_response.length >= 1) {

            for (let i = 0; i < node_machine_mapping_response.length; i++) {

                await machine_mapping_model.findByIdAndDelete(node_machine_mapping_response[i]._id)

            }

        }

        let zone_mapping_response = await zone_mapping_model.find({node_id: id})
        if (zone_mapping_response.length >= 1) {

            for (let i = 0; i < zone_mapping_response.length; i++) {

                await zone_mapping_model.findByIdAndDelete(zone_mapping_response[i]._id)
            }

        }

        return await node.findByIdAndDelete(id)

    }

    async get_node_id(mac){
        let node_response = await node.find({mac:mac})
        if(node_response.length>=1){
            return (node_response[0])._id
        }
        else {
            return ""
        }
    }

    async check_node_by_mac(mac){
        let node_response = await node.find({mac:mac})
        if(node_response.length>=1){
            return true
        }
        return false
    }

}

module.exports = new node_service()