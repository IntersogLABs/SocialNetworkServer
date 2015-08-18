var express = require('express');
var bodyParser = require('body-parser');
GLOBAL._ = require('underscore');
var fs= require('fs')
var app = express();
var async = require('async')

var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.10:27017/socialNetwork';

MongoClient.connect(url, function (err, db) {
	GLOBAL.DB = db;
	app.listen(100, '127.0.0.10');
})

//GLOBAL.DB = {
//    save:function(){
//        fs.writeFileSync('./db.json', JSON.stringify(this))
//    },
//    restore: function(){
//        GLOBAL.DB = _.extend(GLOBAL.DB,JSON.parse(fs.readFileSync('./db.json','utf-8')))
//    }
//}
//GLOBAL.DB.restore();
//DB.users = DB.users || [];
//DB.posts = DB.posts || [];
//DB.follow = DB.follow || [];

app.use(bodyParser.json())

app.use(function (req, res, next) {

    if(req.originalUrl =='/register'){
        next(null);
        return;
    }
    if (!req.headers['authorization']) {
    	res.status(401).send({ message: "Authorization is required" });
        return;
    }
    var parts = req.headers['authorization'].split(":")
    var nick = parts[0];
    var pwd = parts[1];

    //var parts = req.headers['authorization'].split(" ")
    //var nick = parts[1].split("=")[1];
    //var pwd = parts[5].split("=")[1];
    //console.log(req.headers['authorization']);
    //console.log(nick);
    //console.log(pwd);


    DB.collection('users').find({ nick: nick, pwd: pwd }).toArray(function (err, data) {
    	if (data.lenght = 0) {
    		res.status(401).send({ message: "invalid user or password" })
    		return;
    	}
    });
    //var user = _.find(DB.users, function (usr) {
    //    return usr.nick == nick && pwd == usr.pwd;
    //})

    req.currentUser = data[0];
    next(null);
})
require('./controllers/user')(app)
require('./controllers/post')(app)
require('./controllers/follow')(app)


