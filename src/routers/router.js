let express = require('express');
let routes = express.Router();

routes.get('/', function(req, res) {
    res.sendFile(process.cwd()  + '/views/index.html');
});


module.exports = routes;