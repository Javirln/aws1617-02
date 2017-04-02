'use strict';

module.exports = {
  "swagger": "2.0",
    "info": {
        "title": "Researcher API",
        "description": "Researchers\' API endpoint",
        "version": "1.0.0"
    },
    "host": process.env.SWAGGER_HOST,
    "schemes": [
        "https"
    ],
    "basePath": "/api/v1",
    "produces": [
        "application/json"
    ]
};