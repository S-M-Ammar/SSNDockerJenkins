let express = require('express')
let router = new express.Router()
let workshop_controller = require('../controllers/workshop_controller')


router.get('/Workshops',workshop_controller.get_all_workshops)

router.get('/Workshop/:id',workshop_controller.get_one_workshop)

// router.get('/Workshops/Summary',workshop_controller.get_summary_all_workshops)

router.post('/Workshop',workshop_controller.create_workshop)

router.patch('/Workshop',workshop_controller.update_workshop)

router.delete('/Workshop',workshop_controller.delete_workshop)


module.exports = router







