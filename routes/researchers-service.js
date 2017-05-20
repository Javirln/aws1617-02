'use strict';
const _ = require('lodash');

const MongoClient = require('mongodb').MongoClient;
let db;

const Researchers = function () {};

Researchers.prototype.connectDb = function(callback) {
    MongoClient.connect(process.env.MONGODB_URL, function(err, database) {
        if(err) {
            callback(err);
        }
        
        db = database.collection('researchers');
        
        callback(err, database);
    });
};

Researchers.prototype.allResearchers = function(callback) {
    return db.find({}).toArray(callback);
};

Researchers.prototype.add = function(researcher, callback) {
    return db.insert(researcher, callback);
};

Researchers.prototype.removeAll = function(callback) {
    return db.remove({},{ multi: true},callback);
};

Researchers.prototype.get = function(orcid, callback) {
    return db.find({orcid:orcid}).toArray(callback);
};

Researchers.prototype.getQuery = function(query, callback) {
    return db.find(query).toArray(callback);
};

Researchers.prototype.remove = function(orcid, callback) {
    return db.remove({orcid:orcid},{ multi: true}, callback);
};

Researchers.prototype.update = function(orcid, updatedContact, callback) {
    return db.update({orcid:orcid},updatedContact,{}, callback);
};

Researchers.prototype.isValid = function (researcher, orcid){
    let res = true;
    const model = ["orcid", "name", "email", "phone", "address", "university", "group", "projects", "gender"];
    if (orcid === (undefined || null)) {
        if (!_.isEqual(model.sort(), Object.keys(researcher).sort())) {
            res = false;
        } else if (researcher.email.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+/) === (null || ''))  {
            res = false;
        } else if (researcher.orcid.match(/([0-9]{4,4})-([0-9]{4,4})-([0-9]{4,4})-(([0-9]{4,4})|([0-9]{3,3}[X]))/)  === (null || '')) {
            res = false; 
        } else if (researcher.phone.toString().length !== 9) {
            res = false;
        } else if ((researcher.name || researcher.email || researcher.phone || researcher.address || researcher.gender) === ('' || null)) {
            res = false;
        } else if (researcher.gender !== 'male' && researcher.gender !== 'female') {
            res = false;
        }
    } else {
       res = !(orcid.match(/([0-9]{4,4})-([0-9]{4,4})-([0-9]{4,4})-(([0-9]{4,4})|([0-9]{3,3}[X]))/) === null || '');
    }
    return res;
};

module.exports = new Researchers();
