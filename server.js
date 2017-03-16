'use strict';

const express = require('express');
const app = express();
const path = require('path');
const port = (process.env.PORT || 3000);

const bodyParser = require('body-parser');
const researchers = require("./routes/researchers");
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

// ENV MONGODB_URL mongodb://127.0.0.1:27017/aws

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec, false, optionsSwaggerUi));

// Configuration of statics
app.use('/', express.static(path.join(__dirname + '/public')));

//app.use(baseApi + '/researchers', researchers);

app.get(baseApi + "/researchers", (request, response) => {
    console.log("New GET /researcher");
    researchers.allResearchers((err, researchers) => {
        response.send(researchers);
    });
});

app.get(baseApi + "/researchers/:dni", (request, response) => {
    var dni = request.params.dni;
    console.log("GET /researcher/" + dni);

    researchers.get(dni, (err, researcher) => {
        if (researcher.length === 0) {
            response.sendStatus(404);
        }
        else {
            response.send(researcher);
        }
    });
});

app.post(baseApi + "/researchers", (request, response) => {
    console.log("POST /researchers");
    var researcher = request.body;
    researchers.add(researcher);
    response.sendStatus(201);
});

app.put(baseApi + "/researchers/:name", (request, response) => {
    var name = request.params.name;
    var updatedResearcher = request.body;

    researchers.update(name, updatedResearcher, (err, numUpdates) => {
        console.log("Researcher updated:" + numUpdates);
        if (numUpdates === 0) {
            response.sendStatus(404);
        }
        else {
            response.sendStatus(200);
        }

    });

    console.log("UPDATE /researchers/" + name);
});

app.delete(baseApi + "/researchers", (request, response) => {
    console.log("DELETE /researchers");

    researchers.removeAll((err, numRemoved) => {
        console.log("Researchers removed:" + numRemoved);
        response.sendStatus(200);
    });

});

app.delete(baseApi + "/researchers/:dni", (request, response) => {
    var dni = request.params.dni;

    researchers.remove(dni, (err, numRemoved) => {
        console.log("Researchers removed:" + numRemoved);
        response.sendStatus(200);
    });

    console.log("DELETE /researchers/" + dni);
});

researchers.connectDb((err) => {
    if (err) {
        console.log("Could not connect with MongoDB");
        process.exit(1);
    }

    app.listen(port, () => {
        console.log("Server with GUI up and running!");
    });
});

/*
app.listen(port, () => {
    console.log('Server up and running');
});*/
