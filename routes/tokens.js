'use strict';

const express = require('express');
const router = express.Router();
const tokens = require('./tokens-service');
const middleware = require('./middleware');

router.delete('/:dni', function(req, res) {

    tokens.get(req.params.dni, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length === 0) {
            res.status(404).send({
                msg: 'No existe ningún token con ese DNI'
            });
        }
        else {
            tokens.remove(req.params.dni, (err, numRemoved) => {
                if (err) {
                    res.status(404).send({
                        msg: err
                    });
                }
                else {
                    res.statusCode = 200;
                    res.send(numRemoved.toString());
                }
            });
        }
    });
});

router.post('/', function(req, res) {

    tokens.get(req.body.dni, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length !== 0) {
            res.status(409).send({
                msg: 'Ya existe un token asociado a ese DNI'
            });
        }
        else {
            tokens.add(req.body, (err, newDoc) => {
                if (err || newDoc === undefined) {
                    res.status(404).send({
                        msg: err
                    });
                }
                else {
                    res.status(201).send(req.body);
                }
            });
        }
    });
});

router.post('/authenticate', function(req, res) {

    tokens.get(req.body.dni, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length !== 0) {
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: tokens.createToken(req.body.dni)
            });
        }
        else {
            res.status(404).send({
                msg: 'No existe ningún token asociado a ese DNI'
            });
        }
    });
});




router.get('/private', middleware.ensureAuthenticated, function(req, res) {
    var token = req.headers.authorization.split(" ")[1];
    res.json({
        message: 'Estás autenticado correctamente y tu _id es:' + req.user
    });
});

module.exports = router;
