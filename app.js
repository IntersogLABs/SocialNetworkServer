var express = require('express');
var bodyParser = require('body-parser');
GLOBAL._ = require('underscore');
GLOBAL.sha1 = require('sha1');
var fs= require('fs')
var app = express();
GLOBAL.DB = {
    save:function(){
        fs.writeFileSync('./db.json',JSON.stringify(this))
    },
    restore: function(){
        GLOBAL.DB = _.extend(GLOBAL.DB,JSON.parse(fs.readFileSync('./db.json','utf-8')))
    }
}
DB.restore();
DB.users = DB.users || [];
DB.posts = DB.posts || [];
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
    console.log(req.originalUrl);
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
    var user = _.findWhere(DB.users, {"nick":nick, "pwd": sha1(pwd)})

    if (!user) {
        res.status(401).send({message: "invalid user or password"})
        return;
    }
    req.currentUser = user;
    
    next(null);
})
require('./controllers/user')(app)
require('./controllers/post')(app)


app.listen(100)