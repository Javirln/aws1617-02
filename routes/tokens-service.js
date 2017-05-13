'use strict';

const MongoClient = require('mongodb').MongoClient;
let db;
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('./config');
const Tokens = function () {};

var User = function(params) {
    this.orcid = params.orcid;
    this.token = params.token;
    this.apicalls = params.apicalls;
};

Tokens.prototype.connectDb = function(callback) {
    MongoClient.connect(process.env.MONGODB_URL, function(err, database) {
        if(err) {
            callback(err);
        }
        
        db = database.collection('tokens');

        callback(err, database);
    });
};

Tokens.prototype.add = function(user, callback) {
    return db.insert({orcid:user.orcid, token:this.createToken(user), apicalls:0}, callback);
};

Tokens.prototype.addWithToken = function(user, callback) {
    return db.insert({orcid:user.orcid, token:user.token, apicalls:0}, callback);
};

Tokens.prototype.get = function(orcid, callback) {
    return db.find({orcid:orcid}).toArray(callback);
};

Tokens.prototype.compareToken = function(user, callback) {
    return db.findOne(user, function(err, item) {
        if (err) {
            callback(err);
        } else {
            if (item && item != null) {
                callback(err, new User(item));
            } else {
                callback(err, null);
            }
        }
    });
};

Tokens.prototype.remove = function(orcid, callback) {
    return db.remove({orcid:orcid},{ multi: true}, callback);
};

Tokens.prototype.removeAll = function(callback) {
    return db.remove({},{ multi: true},callback);
};

Tokens.prototype.update = function(token, updatedUserInfo, callback) {
    return db.update({token:token},updatedUserInfo,{}, callback);
};


Tokens.prototype.createToken = function(user) {  
  let payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};

module.exports = new Tokens();
