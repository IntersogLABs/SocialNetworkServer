var ObjectId = require('mongodb').ObjectID
var async = require('async')
var auth = require('../auth')
module.exports = function (app) {
    app.get('/me', function (req, res) {
        res.send(req.currentUser);
    })
    app.get('/user', function (req, res) {
        DB.collection('users').find({}).toArray(function (err, data) {

            res.send(data.map(function (user) {
                delete user.pwd;
                return user
            }));

        })


    })
    app.get('/user/:id', function (req, res) {
        DB.collection('users').findOne({_id: new ObjectId(req.params.id)},
            function (err, user) {
                if (!user) {
                    res.status(404).send({message: "not found"})
                    return;
                }
                delete user.pwd;
                res.send(user);
            })
    })
    app.get('/user/:id/wall', function (req, res) {
        var UsersCollection = DB.collection('users')
        DB.collection('posts')
            .find({"ownerId._id": req.params.id})
            .toArray(function (err, posts) {
                async.mapLimit(posts, 5, function (post, next) {
                    UsersCollection.findOne({_id: new ObjectId(post.authorId._id)},
                        function (err, data) {
                            post.author = data;
                            UsersCollection.findOne({_id: new ObjectId(post.ownerId._id)},
                                function (err, data) {
                                    post.owner = data;
                                    next(null,post);
                                })
                        })
                }, function (err,data) {
                    res.send(data);
                })


            })


    })


    app.post('/register', function (req, res) {
        if (!req.body.email) {
            res.status(400).send({message: "Email is required"})
            return;
        } else if (!req.body.nick) {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if (!req.body.pwd || !req.body.repeatPwd || req.body.pwd != req.body.repeatPwd) {
            res.status(400).send({message: "Passwords do not match"})
            return;
        }

        DB.collection('users')
            .find({"email": req.body.email})
            .hasNext(function(err, data){
                if (!data) {
                    DB.collection('users')
                        .find({"nick": req.body.nick})
                        .hasNext(function(err, data){
                            if (!data) {
                                var user = {
                                    email: req.body.email,
                                    nick: req.body.nick,
                                    pwd: auth.encodePassword(req.body.pwd)
                                };

                                DB.collection('users').insert(user, function (err, data) {
                                    delete user.pwd;
                                    res.send(user)
                                })
                            } else {
	                        res.status(400).send({message: "Nick is already registered"})
                            }
                        })
                } else {
	                res.status(400).send({message: "Email is already registered"})
                }
            })
    })
}
