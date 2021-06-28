let express = require('express')
let router = new express.Router()
let zone_controller = require('../controllers/zone_controller')

router.get('/Zones',zone_controller.get_all_zones)

router.get('/Zone/:id',zone_controller.get_one_zone)

router.get('/Zone/Node_Machine_Data/:id',zone_controller.getNodes_and_Machines)

router.post('/Zone',zone_controller.create_zone)

router.patch('/Zone',zone_controller.update_zone)

router.delete('/Zone',zone_controller.delete_zone)

router.get('/Zone/Summary/:id',zone_controller.get_zone_summary)

router.get('/Zone/TemperatureHumidity/Alerts/:id',zone_controller.get_zone_alerts)

router.get('/Zone/Data/:id',zone_controller.get_zone_prev_24hrs_envData)


module.exports = router