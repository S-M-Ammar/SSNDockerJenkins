let express = require('express')
let router = new express.Router()
let zone_mapping_machine_controller = require('../controllers/zone_mapping_machine_controller')

router.get('/ZoneMappingMachines',zone_mapping_machine_controller.get_all_zone_mapping_machines)

router.get('/ZoneMappingMachine/:id',zone_mapping_machine_controller.get_one_zone_mapping_machine)

router.post('/ZoneMappingMachine',zone_mapping_machine_controller.create_zone_mapping_machine)

router.patch('/ZoneMappingMachine',zone_mapping_machine_controller.update_zone_mapping_machine)

router.delete('/ZoneMappingMachine',zone_mapping_machine_controller.delete_zone_mapping_machine)

module.exports = router