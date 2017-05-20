'use strict';

const express = require('express');
const router = express.Router();
const tokens = require('./tokens-service');

router.delete('/:orcid', function(req, res) {

    tokens.get(req.params.orcid, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length === 0) {
            res.status(404).send({
                msg: 'That ORCID is not correct, please register it'
            });
        }
        else {
            tokens.remove(req.params.orcid, (err, numRemoved) => {
                if (err) {
                    res.status(404).send({
                        msg: err
                    });
                }
                else {
                    res.status(200).send({
                        msg: 'Token deleted!'
                    });
                }
            });
        }
    });
});

router.post('/', function(req, res) {

    tokens.get(req.body.orcid, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length !== 0) {
            res.status(409).send({
                msg: 'We already have that ORCID in use'
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

    tokens.get(req.body.orcid, (err, token) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(token).length !== 0) {
            res.status(201).send({
                success: true,
                message: 'Enjoy your token!',
                token: tokens.createToken(req.body.orcid)
            });
        }
        else {
            res.status(404).send({
                msg: 'That ORCID is not correct, please register it'
            });
        }
    });
});

module.exports = router;
