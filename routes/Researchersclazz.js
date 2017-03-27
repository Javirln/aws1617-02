'use strict';

var app = undefined;
var Researchersclazz = function(app){this.app = app};
const express = require('express');
const router = express.Router();

const researchers = require('./researchers-service');


const SocketServer = require("./SocketServer");
var io = new SocketServer(app);

router.get('/', function(req, res) {

    researchers.allResearchers((err, researchers) => {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
        else {
            res.status(200).send(researchers);
        }
    });

});

router.get('/:dni', function(req, res) {
    const dni = req.params.dni;

    researchers.get(dni, (err, researcher) => {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
        else {
            res.status(200).send(researcher);
        }
    });

});

router.post('/', function(req, res) {

    researchers.get(req.body.dni, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length !== 0) {
            res.status(409).send({
                msg: 'Ya existe un investigador con ese DNI'
            });
        }
        else if (researchers.isValid(req.body, null) && Object.keys(researcher).length === 0) {
            researchers.add(req.body, (err, newDoc) => {
                if (err || newDoc === undefined) {
                    res.status(404).send({
                        msg: err
                    });
                }
                else {
                    io.io.sockets.on('connection', (socket) => {
                        socket.emit('newResearcher', 'nr');
                        res.status(201).send(req.body);
                    });
                }
            });
        }
        else {
            res.status(400).send({
                msg: 'Los datos están mal introducidos'
            });
        }
    });
});

router.put('/:dni', function(req, res) {
    const dni = req.params.dni;
    const updatedResearcher = req.body;

    researchers.get(dni, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length === 0) {
            res.status(404).send({
                msg: 'No existe ningún investigador con ese DNI'
            });
        }
        else if (researchers.isValid(null, dni) && Object.keys(researcher).length !== 0) {
            researchers.update(dni, updatedResearcher, (err, numUpdates) => {
                if (err || numUpdates === 0) {
                    res.statusCode = 404;
                    res.send({
                        msg: err
                    });
                }
                else {
                    res.statusCode = 200;
                    res.send(numUpdates.toString());
                }
            });
        }
        else {
            res.status(400).send({
                msg: 'El DNI no es válido'
            });
        }
    });
});


router.delete('/:dni', function(req, res) {

    researchers.get(req.params.dni, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length === 0) {
            res.status(404).send({
                msg: 'No existe ningún investigador con ese DNI'
            });
        }
        else if (researchers.isValid(null, req.params.dni) && Object.keys(researcher).length !== 0) {
            researchers.remove(req.params.dni, (err, numRemoved) => {
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
        else {
            res.status(400).send({
                msg: 'El DNI no es válido'
            });
        }
    });
});

router.delete('/', function(req, res) {

    researchers.removeAll((err, numRemoved) => {
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

});

Researchersclazz.prototype.router = router;
module.exports = Researchersclazz;
