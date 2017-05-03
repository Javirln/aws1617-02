'use strict';

const express = require('express');
const router = express.Router();
const tokens = require('./tokens-service');

router.delete('/:dni', function(req, res) {

    tokens.get(req.params.dni, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length === 0) {
            res.status(404).send({
                msg: 'That DNI is not correct, please register it'
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
                msg: 'We already have that DNI in use'
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
            res.status(201).send({
                success: true,
                message: 'Enjoy your token!',
                token: tokens.createToken(req.body.dni)
            });
        }
        else {
            res.status(404).send({
                msg: 'That DNI is not correct, please register it'
            });
        }
    });
});

module.exports = router;
