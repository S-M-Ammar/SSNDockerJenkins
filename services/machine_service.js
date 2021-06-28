let machine = require('../models/machine')
let machine_mapping_model = require('../models/machine_mapping')
let configuration_service = require('../services/configuration_service')
let zone_mapping_machine_model = require('../models/zone_mapping_machine')
let machine_states_model = require('../models/machine_state')
let machine_service_model = require('../models/machine_maintenance')
let demo_model = require('../models/demo_model')
let moment = require('moment-timezone')

class machine_service{

    async get_all_machines(){

        return await machine.find({})
    }

    async get_one_machine(id){

        return await machine.find({_id:id})
    }

    async create_machine(parameters){

        let _machine = machine(parameters)
        return await _machine.save()
    }

    async update_machine(update_parameters){

        let id = update_parameters.id
        delete update_parameters.id

        let res = await machine.findByIdAndUpdate(id,update_parameters)

        let machine_mapping_response = await machine_mapping_model.find({machine_id:id})

        if(machine_mapping_response.length>=1){
            let node_id = machine_mapping_response[0].node_id
            configuration_service.send_configuration_message({node_id:node_id}).then((result)=>{
                console.log(result)
            }).catch((error)=>{
                console.log(error)
            })
        }

        return res
    }

    async add_service_time(parameters){
        parameters.maintenance_history = [{
            maintenance_performed_on:new Date(parameters.maintenance_history[0].maintenance_performed_on)
        }]
        let machine_service = machine_service_model({
            machine_id:parameters.machine_id,
            maintenance_recurrence_period_hours:parameters.maintenance_recurrence_period_hours,
            maintenance_history:parameters.maintenance_history
        })
        let res =  await machine_service.save()
        let time = parameters.maintenance_history[0].maintenance_performed_on.getTime()
        time = time + (parameters.machine_runtime*3600000)
        let endtime = moment(time).toDate()
        let utilization_data = machine_states_model({
            machine_id: parameters.machine_id,
            state:"ON",
            start_time:parameters.maintenance_history[0].maintenance_performed_on,
            end_time:endtime,
            timestamp:moment().toDate()
        })
        await utilization_data.save()
        return res
    }

    async update_machine_maintenance_history(parameters){
        let maintenance_date = new Date(parameters.maintenance_date)
        let data = await machine_service_model.find({machine_id:parameters.machine_id})
        if(data.length>=1){
            data[0].maintenance_history.push({maintenance_performed_on : maintenance_date})
            let res = await machine_service_model.findByIdAndUpdate(data[0]._id,{maintenance_history:data[0].maintenance_history})
            return res
        }
        else {
            return null
        }

    }

    async get_config_for_maintenance(machine_id){
        let data = await machine_service_model.find({machine_id:machine_id})
        if(data.length>=1){
            let last_maintenance_date = data[0].maintenance_history[data[0].maintenance_history.length - 1]
            last_maintenance_date = last_maintenance_date.maintenance_performed_on
            return {
                maintenance_recurrence_period_hours:data[0].maintenance_recurrence_period_hours,
                last_maintenance_date:last_maintenance_date
            }
        }
        else {

            return null
        }
    }

    async get_maintenance_due_time(machine_id){
        let data = await machine_service_model.find({machine_id:machine_id})
        if(data.length>=1){
            let curr_date = moment().toDate()
            let maintenance_date = await this.get_config_for_maintenance(machine_id)
            maintenance_date = maintenance_date.last_maintenance_date
            let utilizaton_data = await this.get_utilization(maintenance_date,curr_date,machine_id)
            let on_time = utilizaton_data['ON-Time']
            on_time = on_time.split(":")
            let on_time_hours = parseFloat(on_time[0]) + parseFloat(on_time[1]/60) + parseFloat(on_time[2]/3600)
            let due_time = data[0].maintenance_recurrence_period_hours - on_time_hours
            // let diffTime = Math.abs(curr_date - maintenance_date);
            // let diffHrs = Math.ceil(diffTime / (1000 * 60 * 60));
            return {

                machine_id:machine_id,
                maintenance_recurrence_period_hours:data[0].maintenance_recurrence_period_hours,
                machine_maintenance_due_time_hrs:due_time,
                maintenance_history:data[0].maintenance_history
            }
        }
        else {

            return null
        }
    }

    // async get_service_time(id){
    //     let machine_service = await machine_service_model.find({machine_id:id})
    //     if(machine_service.length>=1){
    //         let machine_service_data = machine_service[0]
    //
    //         let start_time = await demo_model.findOne({machine_id:id})
    //         if(Object.keys(start_time).length>=1){
    //
    //             start_time = start_time.timestamp
    //             let endtime = await demo_model.find({machine_id:id}).sort({_id:-1}).limit(1)
    //
    //             if(endtime.length==1){
    //
    //                 endtime = endtime[0].timestamp
    //                 let utilizaton_data = await this.get_utilization(start_time,endtime,id)
    //                 let on_time = utilizaton_data['ON-Time']
    //                 on_time = on_time.split(":")
    //                 let on_time_hours = parseFloat(on_time[0]) + parseFloat(on_time[1]/60) + parseFloat(on_time[2]/3600)
    //
    //                 let due_time_hrs =  machine_service_data.service_time_hours - on_time_hours
    //
    //                 return {
    //                     machine_id:id,
    //                     service_due_time_hrs:due_time_hrs
    //                 }
    //
    //             }
    //             else {
    //                 return "No machine found"
    //             }
    //         }
    //         else{
    //
    //             return "No machine found"
    //         }
    //
    //     }
    //     else {
    //         return "No machine found"
    //     }
    // }

    async get_fullTime(time){
        return new Promise(((resolve, reject) => {

            try{
                let str_hours = String(time)
                let temp_1 = str_hours.split(".");
                if(temp_1.length>1){
                    let hours = String(temp_1[0])
                    let temp_mins = "."+temp_1[1]
                    temp_mins = parseFloat(temp_mins) * 60
                    temp_mins = String(temp_mins)

                    let temp_2 = temp_mins.split(".")
                    let str_mins = temp_2[0]
                    if(temp_2.length>1){
                        let temp_secs = "."+temp_2[1]
                        temp_secs = parseFloat(temp_secs) * 60
                        temp_secs = parseInt(temp_secs)
                        let str_secs = String(temp_secs)
                        resolve(hours+":"+str_mins+":"+str_secs)
                    }
                    else {
                        resolve(hours+":"+str_mins+":"+"00")
                    }


                }
                else {
                    resolve( temp_1[0]+":00:00")
                }

            }
            catch (e) {
                reject(e)
            }


        }))
    }


    async get_machine_utilization(parameters){
        try{
            let max_time  = new Date(parameters.timestamp)
            max_time.setHours(max_time.getHours() - 5)
            let min_time = new Date(parameters.timestamp)
            min_time.setHours(min_time.getHours() - parameters.duration - 5)
            let utilization_data = await this.get_utilization(min_time,max_time,parameters.id)
            return utilization_data
        }
        catch (e) {

            return (e)
        }

    }

    async delete_machine(id){

        let machine_in_mapping_response = await machine_mapping_model.find({machine_id:id})

        if(machine_in_mapping_response.length>=1){

            await machine_mapping_model.findByIdAndDelete(machine_in_mapping_response[0]._id)
        }

        let machine_in_zone_machine_mapping_response = await zone_mapping_machine_model.find({machine_id:id})

        if(machine_in_zone_machine_mapping_response.length>=1){

            await zone_mapping_machine_model.findByIdAndDelete(machine_in_zone_machine_mapping_response[0]._id)
        }

        return await machine.findByIdAndDelete(id)
    }

   async get_utilization(min_time,max_time,id){
        return new Promise((async (resolve, reject) => {

            try{
                let states_data  = await machine_states_model.find({machine_id: id}).or([

                    {$and:[{start_time:{$lte:min_time}},{end_time:{$gte:max_time}}]},
                    {$and:[{start_time:{$gt:min_time}},{end_time:{$lt:max_time}}]},
                    {$and:[{start_time:{$lte:min_time}},{end_time:{$gte:min_time}}]},
                    {$and:[{start_time:{$lte:max_time}},{end_time:{$gte:max_time}}]},

                ])

                let utilization_dict = {"ON-hrs":0,"OFF-hrs":0,"IDLE-hrs":0}

                if(states_data.length>=1){

                    for(let i=0;i<states_data.length;i++){
                        if(min_time.getTime()>=states_data[i].start_time.getTime() && max_time.getTime()<=states_data[i].end_time.getTime()){

                            let duration = (max_time-min_time)
                            let diffHours = (duration / (1000 * 60 * 60));
                            if(states_data[i].state=="ON"){

                                utilization_dict['ON-hrs'] = utilization_dict['ON-hrs'] + diffHours
                            }
                            else if(states_data[i].state=="OFF"){
                                utilization_dict['OFF-hrs'] = utilization_dict['OFF-hrs'] + diffHours
                            }
                            else {
                                utilization_dict['IDLE-hrs'] = utilization_dict['IDLE-hrs'] + diffHours
                            }

                        }
                        else if(min_time<states_data[i].start_time.getTime() && max_time>states_data[i].end_time.getTime()){

                            let duration = (states_data[i].end_time - states_data[i].start_time)
                            let diffHours = (duration / (1000 * 60 * 60));
                            if(states_data[i].state=="ON"){

                                utilization_dict['ON-hrs'] = utilization_dict['ON-hrs'] + diffHours
                            }
                            else if(states_data[i].state=="OFF"){
                                utilization_dict['OFF-hrs'] = utilization_dict['OFF-hrs'] + diffHours
                            }
                            else {
                                utilization_dict['IDLE-hrs'] = utilization_dict['IDLE-hrs'] + diffHours
                            }

                        }
                        else if(min_time>=states_data[i].start_time.getTime() && min_time<=states_data[i].end_time.getTime()){

                            let duration = (states_data[i].end_time - min_time)
                            let diffHours = (duration / (1000 * 60 * 60));
                            if(states_data[i].state=="ON"){

                                utilization_dict['ON-hrs'] = utilization_dict['ON-hrs'] + diffHours
                            }
                            else if(states_data[i].state=="OFF"){
                                utilization_dict['OFF-hrs'] = utilization_dict['OFF-hrs'] + diffHours
                            }
                            else {
                                utilization_dict['IDLE-hrs'] = utilization_dict['IDLE-hrs'] + diffHours
                            }

                        }
                        else if(max_time>=states_data[i].start_time.getTime() && max_time<=states_data[i].end_time.getTime()){

                            let duration = (max_time - states_data[i].start_time)
                            let diffHours = (duration / (1000 * 60 * 60));
                            if(states_data[i].state=="ON"){

                                utilization_dict['ON-hrs'] = utilization_dict['ON-hrs'] + diffHours
                            }
                            else if(states_data[i].state=="OFF"){
                                utilization_dict['OFF-hrs'] = utilization_dict['OFF-hrs'] + diffHours
                            }
                            else {
                                utilization_dict['IDLE-hrs'] = utilization_dict['IDLE-hrs'] + diffHours
                            }
                        }
                    }
                    let on_time = await this.get_fullTime(utilization_dict['ON-hrs'])
                    let off_time = await this.get_fullTime(utilization_dict['OFF-hrs'])
                    let idle_time = await this.get_fullTime(utilization_dict['IDLE-hrs'])

                    resolve({"ON-Time":on_time,"OFF-Time":off_time,"IDLE-Time":idle_time})

                }
                else {
                    let check_machine_resposne = await machine_states_model.find({machine_id: id}).sort({_id:-1}).limit(1)
                    if(check_machine_resposne.length>=1){

                        resolve({"ON-Time":"0:00:00","OFF-Time":"0:00:00","IDLE-Time":"0:00:00"})
                        return
                    }
                    resolve("No machine found")
                }
            }
            catch (e) {
                reject(e)
            }

        }))
   }

}

module.exports = new machine_service()