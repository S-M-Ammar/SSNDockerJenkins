let workshop = require('../models/workshop')
class workshop_service{

    async get_all_workshops(){

        return await workshop.find({})
    }

    async get_one_workshop(id){

        return await workshop.find({_id:id})
    }

    async create_workshop(parameters){

        let _workshop = workshop(parameters)
        return await _workshop.save()
    }

    async update_workshop(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id
        return await workshop.findByIdAndUpdate(id,update_parameters)
    }

    async delete_workshop(id){
        return await workshop.findByIdAndDelete(id)
    }

}

module.exports = new workshop_service()