'use strict';

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

module.exports = new Researchers();
