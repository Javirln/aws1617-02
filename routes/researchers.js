'use strict';

const express = require('express');
const router = express.Router();

const researchers = require('./researchers-service');

router.get('/', function (req, res) {
    
    researchers.allresearchers((err, researchers) => {
        if (err) {
            res.status(404).send({msg: err});
        } else {
            res.status(200).send(researchers);   
        }
    });
    
});

router.get('/:dni', function (req, res) {
    const dni = req.params.dni;
    
    researchers.get(dni, (err, contact) => {
        if (err) {
            res.status(404).send({msg: err});
        } else {
            res.status(200).send(contact[0]);   
        }
    });

});

router.post('/', function (req, res) {
    researchers.add(req.body, (err, newDoc) => {
        if (err || newDoc === undefined) {
            res.status(404).send({msg: err});
        } else {
            res.status(201).send(req.body);       
        }
    });
    
});

router.put('/:dni', function (req, res) {
    const dni = req.params.dni;
    const updatedContact = req.body;
    
    researchers.update(dni, updatedContact, (err, numUpdates) => {
        if (err || numUpdates === 0) {
            res.statusCode = 404;
            res.send({msg: err});
        } else {
            res.statusCode = 200;
            res.send(numUpdates.toString());
        }
    });
});


router.delete('/:dni', function (req, res) {
    
    researchers.remove(req.params.dni, (err, numRemoved) => {
        if (err) {
            res.status(404).send({msg: err});
        } else {
            res.statusCode = 200;
            res.send(numRemoved.toString());
        }
    });
    
});

router.delete('/', function (req, res) {
    
    researchers.removeAll((err, numRemoved) => {
        if (err) {
            res.status(404).send({msg: err});
        } else {
            res.statusCode = 200;
            res.send(numRemoved.toString());
        }
    });
    
});

module.exports = router;