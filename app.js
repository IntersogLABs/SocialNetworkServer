GLOBAL._ = require('underscore');
GLOBAL.sha1 = require('sha1');
GLOBAL.ObjectID = require('mongodb').ObjectID;
GLOBAL.async = require('async');

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs')
var app = express();
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/socialNetwork'; // в консоли монго смотреть через: use socialNetwork, затем можно db.users.find({}) и т.п.
MongoClient.connect(url, function(err, db){

    console.log("Connected corretly to server");

    GLOBAL.DB = db; 
    GLOBAL.UsersCollection = DB.collection('users');
    GLOBAL.PostsCollection = DB.collection('posts');

    app.listen(100)
})

console.log("run");

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.use(bodyParser.json())
app.use(function (req, res, next) {
    if(req.originalUrl =='/register'){
        next(null);
        return;
    }
    if (!req.headers['authorization']) {
        res.status(401).send({message: "No auth"});
        return;
    }
    var parts = req.headers['authorization'].split(":")
    var nick = parts[0];
    var pwd = parts[1];
    DB.collection('users').findOne({nick:nick,pwd:sha1(pwd)}, function(err,data){
        if (data) {
            req.currentUser = data;
            next(null);
            return
        }
        res.status(401).send({message: "invalid user or password"})
    })
})


require('./controllers/user')(app);
require('./controllers/post')(app);

GLOBAL.deletePwd = function(users){
    if (_.isArray(users)){
        return _.map(users, function(user){
            var userCopy = _.clone(user)
            delete userCopy.pwd;
            return userCopy;
        })
    } else {
        var userCopy = _.clone(users)
        delete userCopy.pwd;
        return userCopy;
    }
}