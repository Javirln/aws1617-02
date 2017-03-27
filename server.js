'use strict';

const express = require('express');
const app = express();
const path = require('path');
var http = require('http');
const port = (process.env.PORT || 3000);

const bodyParser = require('body-parser');
const researchersService = require("./routes/researchers-service");
const researchers = require('./routes/researchers');
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
app.use('/tests', express.static(path.join(__dirname + '/public/tests.html')));

app.use('/favicon.ico', express.static('./favicon.ico'));

app.use(baseApi + '/researchers', researchers);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    console.log("User connected");
    socket.broadcast.emit('testing', 'hello!');
});

researchersService.connectDb((err) => {
    if (err) {
        console.log("Could not connect with MongoDB");
        process.exit(1);
    }

    server.listen(port, function() {
        console.log("Server with GUI up and running!");
    });
});

module.exports = app;
