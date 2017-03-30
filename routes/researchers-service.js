'use strict';
const _ = require('lodash');

var MongoClient = require('mongodb').MongoClient;
var db;

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

Researchers.prototype.get = function(dni, callback) {
    return db.find({dni:dni}).toArray(callback);
};

Researchers.prototype.remove = function(dni, callback) {
    return db.remove({dni:dni},{ multi: true}, callback);
};

Researchers.prototype.update = function(dni, updatedContact, callback) {
    return db.update({dni:dni},updatedContact,{}, callback);
};

Researchers.prototype.isValid = function (researcher, dni){
    let res = true;
    const model = ["dni", "name", "email", "phone", "address", "gender"];
    if (dni === (undefined || null)) {
        if (!_.isEqual(model.sort(), Object.keys(researcher).sort())) {
            res = false;
        } else if (researcher.email.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+/) === (null || ''))  {
            res = false;
        } else if (researcher.dni.match(/(\d{8})([aA-zZ]{1})/)  === (null || '')) {
            res = false; 
        } else if (researcher.phone.toString().length !== 9) {
            res = false;
        } else if ((researcher.name || researcher.email || researcher.phone || researcher.address || researcher.gender) === ('' || null)) {
            res = false;
        } else if (researcher.gender !== 'male' && researcher.gender !== 'female') {
            res = false;
        }
    } else {
       res = !(dni.match(/(\d{8})([aA-zZ]{1})/) === null || '');
    }
    return res;
};

module.exports = new Researchers();
