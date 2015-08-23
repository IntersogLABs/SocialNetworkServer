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
            .find({"ownerId._id": new ObjectId(req.params.id)})
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
        var UsersCollection = DB.collection('users')
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

        UsersCollection
            .find({"email": req.body.email})
            .hasNext(function(err, data){
                if (!data) {
                    UsersCollection
                        .find({"nick": req.body.nick})
                        .hasNext(function(err, data){
                            if (!data) {
                                var user = {
                                    email: req.body.email,
                                    nick: req.body.nick,
                                    pwd: auth.encodePassword(req.body.pwd)
                                };

                                UsersCollection.insert(user, function (err, data) {
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

    app.put('/me', function (req, res) {
        var UsersCollection = DB.collection('users')
        var userInfo = {}
        if (req.body.email) {userInfo.email = req.body.email}
        if (req.body.nick) {userInfo.nick = req.body.nick}
        if (req.body.pwd) {userInfo.pwd = auth.encodePassword(req.body.pwd)}

        var checkEmail = function() {
            UsersCollection
                .find({"email": req.body.email})
                .hasNext(function(err, data){
                    if (!data) {
                        if (userInfo.nick) {
                            checkNick()
                        } else {
                            updateUser()
                        }
                    } else {
	                    res.status(400).send({message: "Email is already registered"})
                    }
                })
        }

        var checkNick = function() {
            UsersCollection
                .find({"nick": req.body.nick})
                .hasNext(function(err, data){
                    if (!data) {
                        updateUser()
                    } else {
	                    res.status(400).send({message: "Nick is already registered"})
                    }
                })
        }

        var updateUser = function() {
		    UsersCollection.updateOne({_id: req.currentUser._id},
	            {$set: userInfo},
	            function(err, result) {
		            res.send(result)
	            })
        }

        if (userInfo.email) {
            checkEmail()
        } else if (userInfo.nick) {
            checkNick()
        } else {
            updateUser()
        }

    })
}
