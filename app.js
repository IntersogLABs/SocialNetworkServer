var express = require('express');
var bodyParser = require('body-parser');
GLOBAL._ = require('underscore');
var app = express();
var MongoClient = require('mongodb').MongoClient;
GLOBAL.ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.10:27017/socialNetwork';

MongoClient.connect(url, function (err, db) {
	GLOBAL.DB = db;
	GLOBAL.UsersCollection = DB.collection('users');
	GLOBAL.PostsCollection = DB.collection('posts');
	GLOBAL.FollowCollection = DB.collection('follow');

	app.listen(100, '127.0.0.10');
	console.log("Connected to server correctly");
})

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(bodyParser.json())

app.use(function (req, res, next) {

	if (req.originalUrl == '/register') {
        next(null);
        return;
    }
    if (!req.headers['authorization']) {
    	res.status(401).send({ message: "Authorization is required" });
        return;
    }
    var parts = req.headers['authorization'].split(":")
    var nick = parts[0];
    var pwd = require('crypto').createHash('md5').update(parts[1]).digest('hex');

    UsersCollection.find({ nick: nick, pwd: pwd }).toArray(function (err, data) {
    	if (data.length==0) {
    		res.status(401).send({ message: "Invalid user or password" });
    		return;
    	}
    	req.currentUser = data[0];
    	next(null);
    });
})
require('./controllers/user')(app)
require('./controllers/post')(app)
require('./controllers/follow')(app)


//var fs= require('fs')
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
