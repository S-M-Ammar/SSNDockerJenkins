let mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/SSN-Staging',{
mongoose.connect('mongodb://mongo:27017/SSN-Staging',{

    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false

})

module.exports = mongoose