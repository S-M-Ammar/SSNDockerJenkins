let express = require('express')
let router = new express.Router()
let demo_controller = require('../controllers/demo_controller')


router.get('/data/:id',demo_controller.send_data)


module.exports = router