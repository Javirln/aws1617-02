'use strict';

const express = require('express');
const router = express.Router();
const researchers = require('./researchers-service');
const passport = require("passport");

router.get('/', passport.authenticate('bearer', {
    session: false
}), function(req, res) {
    var query = req.query;
    if (Object.keys(req.query).length === 0) {
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
    }
    else if (query !== {}) {
        //EXAMPLE: http://aws-researcher-api-aws1617dcp.c9users.io/api/v1/researchers?group=1&projects=1,2
        if (query.hasOwnProperty("group"))
            query.group = parseInt(query.group);

        if (query.hasOwnProperty("projects")) {
            query.projects = req.query.projects.split(',');
            var n = query.projects.length;
            for (var i = 0; i < n; i++) {
                query.projects[i] = parseInt(query.projects[i]);
            }
        }
        researchers.getQuery(query, (err, researchers) => {
            if (err) {
                res.status(404).send({
                    msg: err
                });
            }
            else {
                res.status(200).send(researchers);
            }
        });
    }
    else {
        res.status(400).send({
            msg: 'Data is wrong'
        });
    }

});

router.get('/:orcid', passport.authenticate('bearer', {
    session: false
}), function(req, res) {
    const orcid = req.params.orcid;

    researchers.get(orcid, (err, researcher) => {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }
        else if (researcher.length === 0) {
            res.status(404).send({
                msg: 'We dont have a researcher with that ORCID'
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
                msg: 'We already have a researcher with that ORCID'
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
                msg: 'Data is wrong'
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
                msg: 'We dont have a researcher with that ORCID'
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
                msg: 'ORCID is not valid'
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
                msg: 'We dont have a researcher with that ORCID'
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
                msg: 'ORCID is not valid'
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
