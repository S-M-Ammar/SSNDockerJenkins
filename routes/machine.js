let express = require('express')
let router = new express.Router()
let machine_controller = require('../controllers/machine_controller')

router.get('/Machines',machine_controller.get_all_machines)

router.get('/Machine/:id',machine_controller.get_one_machine)

router.post('/Machine',machine_controller.create_machine)

router.patch('/Machine',machine_controller.update_machine)

router.get('/Machine/State/Utilization',machine_controller.get_machine_utilization)

router.delete('/Machine',machine_controller.delete_machine)

router.post('/MachineMaintenance/SetConfig',machine_controller.add_machine_service_time)

router.patch('/MachineMaintenance/UpdateConfig',machine_controller.update_machine_maintenance_history)

router.get('/MachineMaintenance/ViewConfig/:id',machine_controller.get_config_for_maintenance)

router.get('/MachineMaintenance/MaintenanceDue/:id',machine_controller.get_maintenance_due_time)

module.exports = router