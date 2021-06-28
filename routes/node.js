let express = require('express')
let router = new express.Router()
let node_controller = require('../controllers/node_controller')

router.get('/UnregisteredNodes',node_controller.get_unregistered_nodes)

router.get('/Nodes',node_controller.get_all_nodes)

router.get('/Node/:id',node_controller.get_one_node)

router.post('/Node',node_controller.create_node)

router.patch('/Node',node_controller.update_node)

router.delete('/Node',node_controller.delete_node)

module.exports = router