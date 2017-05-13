'use strict';

const express = require('express');
const router = express.Router();
const researchers = require('./researchers-service');
const passport = require("passport");

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

router.get('/:orcid', function(req, res) {
    const orcid = req.params.orcid;

    researchers.get(orcid, (err, researcher) => {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
        else if (researcher.length === 0) {
            res.status(404).send({
                msg: 'No existe investigador con ese ORCID'
            });
        }
        else {
            res.status(200).send(researcher);
        }
    });

});

router.post('/', passport.authenticate('bearer', {
    session: false
}), function(req, res) {

    researchers.get(req.body.orcid, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length !== 0) {
            res.status(409).send({
                msg: 'Ya existe un investigador con ese ORCID'
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
                    res.status(201).send(req.body);
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

router.put('/:orcid', passport.authenticate('bearer', {
    session: false
}), function(req, res) {
    const orcid = req.params.orcid;
    const updatedResearcher = req.body;

    researchers.get(orcid, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length === 0) {
            res.status(404).send({
                msg: 'No existe ningún investigador con ese ORCID'
            });
        }
        else if (researchers.isValid(null, orcid) && Object.keys(researcher).length !== 0) {
            researchers.update(orcid, updatedResearcher, (err, numUpdates) => {
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
                msg: 'El ORCID no es válido'
            });
        }
    });
});


router.delete('/:orcid', passport.authenticate('bearer', {
    session: false
}), function(req, res) {

    researchers.get(req.params.orcid, (err, researcher) => {
        if (err) {
            res.status(500).send({
                msg: 'Internal server error'
            });
        }
        if (Object.keys(researcher).length === 0) {
            res.status(404).send({
                msg: 'No existe ningún investigador con ese ORCID'
            });
        }
        else if (researchers.isValid(null, req.params.orcid) && Object.keys(researcher).length !== 0) {
            researchers.remove(req.params.orcid, (err, numRemoved) => {
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
                msg: 'El ORCID no es válido'
            });
        }
    });
});

router.delete('/', passport.authenticate('bearer', {
    session: false
}), function(req, res) {

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

module.exports = router;
