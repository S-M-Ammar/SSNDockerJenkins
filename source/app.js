require('../database/mongoose')
require('../servers/upd_server')
require('../servers/express_server')
require('../utils/client_communication')
require('../utils/demo_server_communication')
require('../utils/client_communication_mqtt')
require('../utils/demo_server_communication_mqtt')
let cors = require('cors')
let app = require('../servers/express_server').app
app.use(cors())

let workshop_router = require('../routes/workshop')
let zone_router = require('../routes/zone')
let node_router = require('../routes/node')
let machine_router = require('../routes/machine')
let zone_mapping_router = require('../routes/zone_mapping')
let machine_mapping_router = require('../routes/machine_mapping')
let demo_router = require('../routes/demo_route')
let zone_mapping_machine_router = require('../routes/zone_mapping_machine')

// *******************************************  Swagger - API  *************************************************************************//
let swaggerUi = require('swagger-ui-express')
let swaggerDocument = require('../swagger.json')

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
// ************************************************************************************************************************************//

app.use(workshop_router)
app.use(zone_router)
app.use(node_router)
app.use(machine_router)
app.use(zone_mapping_router)
app.use(machine_mapping_router)
app.use(demo_router)
app.use(zone_mapping_machine_router)


