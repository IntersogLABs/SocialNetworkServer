var express = require('express');
var bodyParser = require('body-parser');
GLOBAL._ = require('underscore');
var fs = require('fs')
GLOBAL.sha1 = require('js-sha1');
var app = express();
GLOBAL.DB = {
    save:function(){
        fs.writeFileSync('./db.json',JSON.stringify(this))
    },
    restore: function(){
        GLOBAL.DB = _.extend(GLOBAL.DB,JSON.parse(fs.readFileSync('./db.json','utf-8')))
    }
}
GLOBAL.DB.restore();
DB.users = DB.users || [];
DB.posts = DB.posts || [];


app.use(bodyParser.json())
app.use(function (req, res, next) {
    console.log(req.originalUrl)
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
    var pwd = sha1(parts[1]);
    //console.log(nick + pwd)
    var user = _.find(DB.users, function (usr) {
        return usr.nick == nick && pwd == usr.pwd;
    })
    //console.log(user)
    if (!user) {
        res.status(401).send({message: "invalid user or password"})
        return;
    }
    req.currentUser =user;
    //console.log(req.currentUser)
    next(null);
})
require('./controllers/user')(app)
require('./controllers/post')(app)


app.listen(100)