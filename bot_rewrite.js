const fs = require('fs');

// Setup DB
let Sequelize = require('sequelize');
let models = require('./models');
models.sequelize.sync();

// Setup requests to redirect to the index page
let express = require('express');
let app = express();
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
});