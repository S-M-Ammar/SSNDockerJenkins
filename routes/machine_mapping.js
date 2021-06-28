let express = require('express')
let router = new express.Router()
let machine_mapping_controller = require('../controllers/machine_mapping_controller')

router.get('/MachineMappings',machine_mapping_controller.get_all_machine_mappings)

router.get('/MachineMapping/:id',machine_mapping_controller.get_one_machine_mapping)

router.post('/MachineMapping',machine_mapping_controller.create_machine_mapping)

router.patch('/MachineMapping',machine_mapping_controller.update_machine_mapping)

router.delete('/MachineMapping',machine_mapping_controller.delete_machine_mapping)

module.exports = router