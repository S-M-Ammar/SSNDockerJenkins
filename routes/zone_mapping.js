let express = require('express')
let router = new express.Router()
let zone_mapping_controller = require('../controllers/zone_mapping_controller')

router.get('/ZoneMappings',zone_mapping_controller.get_all_zone_mappings)

router.get('/ZoneMapping/:id',zone_mapping_controller.get_one_zone_mapping)

router.post('/ZoneMapping',zone_mapping_controller.create_zone_mapping)

router.patch('/ZoneMapping',zone_mapping_controller.update_zone_mapping)

router.delete('/ZoneMapping',zone_mapping_controller.delete_zone_mapping)

module.exports = router