'use strict';

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const port = (process.env.PORT || 3000);
require('dotenv').config();

const bodyParser = require('body-parser');
const researchersService = require("./routes/researchers-service");
const researchers = require('./routes/researchers');
const tokensService = require("./routes/tokens-service");
const tokens = require('./routes/tokens');
const baseApi = '/api/v1';
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./swaggerDef');

// Used to logs all API calls
app.use(logger('dev'));

// Configuration of body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Configuration of API documentation
// Options for swagger docs
const options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./api-documentation.yml'],
};

const optionsSwaggerUi = {
    validatorUrl: null
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false, optionsSwaggerUi));

// Configuration of statics
app.use('/', express.static(path.join(__dirname + '/public')));
app.use(baseApi + '/tests', express.static(path.join(__dirname + '/public/tests.html')));
app.use(baseApi + '/tokens', express.static(path.join(__dirname + '/public/tokens.html')));
app.use('/favicon.ico', express.static('./favicon.ico'));
/**
app.use(function (req, res) {
  res.status(404).send("Sorry we can't find that :(");
});
**/
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(baseApi + '/researchers', researchers);
app.use(baseApi + '/tokens', tokens);


// Socket configuration
io.sockets.on('connection', (socket) => {
    console.log("User connected");

    socket.on('nr', function() {
        io.emit('newResearcher', 'nr');
    });
});

researchersService.connectDb((err) => {
    if (err) {
        console.log("Could not connect with MongoDB researchers");
        process.exit(1);
    }

    tokensService.connectDb((err) => {
        if (err) {
            console.log("Could not connect with MongoDB tokens");
            process.exit(1);
        }

        server.listen(port, function() {
            console.log("Server with GUI up and running!");
        });
    });
});

module.exports = app;
