'use strict';

const express = require('express');
const app = express();
const path = require('path');
const port = ( process.env.PORT || 3000);

const bodyParser = require('body-parser');
const researchers = require("./routes/researchers");
const baseApi = '/api/v1';
const logger = require('morgan');

// Used to logs all API calls
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname + '/public')));

app.use(baseApi + '/researchers', researchers);

app.listen(port, () => {
    console.log('Server up and running');
});