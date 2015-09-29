
var ObjectId = require('mongodb').ObjectID
var async = require('async')
module.exports = function (app) {

    app.get('/me', function (req, res) {
        res.send(req.currentUser);
    })

    app.put('/me', function(req, res){
        if(req.currentUser.nick != req.body.nick && req.body.nick) req.currentUser.nick = req.body.nick
        if(req.currentUser.pwd != req.body.pwd && req.body.pwd) req.currentUser.pwd = req.body.pwd
        if(req.currentUser.email != req.body.email && req.body.email) req.currentUser.email = req.body.email
        DB.collection('users').update({_id: req.currentUser._id}, req.currentUser)
        res.send(req.currentUser)
    })

    app.get('/user', function (req, res) {
        console.log('!!!!!!!!!!!!!!!!!!!!!')
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

    app.post('/user/:id/follow', function(req, res) {

        if(req.params.id == req.currentUser._id) {
            res.status(400).send('You can\'t follow yourself')
            return;
        }
        if(_.find(req.currentUser.follow, function(followingId) {
                return req.params.id == followingId;

            })) {
            res.status(400).send('There is such user in follows already OR you can\'t follow he/she')
            return;
        }

        if(!req.currentUser.follow)  req.currentUser.follow = []
        req.currentUser.follow.push(req.params.id);

        DB.collection('users').update({_id: req.currentUser._id}, req.currentUser)
        res.send(req.currentUser.follow)
    })

    app.delete('/user/:id/follow', function(req, res) {
        DB.collection('users').findOne({_id: req.currentUser._id}, function(err, data){
            var id;
            data.follow.forEach(function(item, i, arr) {
                if(item == req.params.id) {
                    id = i
                    return
                }
            })
            if(id != undefined) {
                data.follow.splice(id, 1)
                DB.collection('users').update({_id: req.currentUser._id}, data)
                res.send(req.currentUser)
            } else {
                res.status(400).send('No such user')
                return
            }

        })
    })

    app.get('/user/:id/followers', function(req, res) {
        var followers = [];

        DB.collection('users').find({}).toArray(function (err, data) {
            data.forEach(function(index, i, arr) {
                _.each(index.follow, function(item, j, array) {
                    if(item == req.params.id) followers.push(index._id);
                })
            })
            if(followers == []) {
                res.status(400).send('The is no followers')
                return
            }
            res.send(followers)
        })

    })

    app.get('/user/:id/following', function(req, res) {
        DB.collection('users').findOne({_id: new ObjectId(req.params.id)},
            function (err, user) {
                if (!user) {
                    res.status(404).send({message: "not found"})
                    return;
                }
                res.send(user.follow);
            })
    })


    app.post('/register', function (req, res) {
        //проверить свободен ли ник и имейл
        console.log(req)
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
        var user = {
            email: req.body.email,
            nick: req.body.nick,
            pwd: req.body.pwd
        };

        DB.collection('users').insert(user, function (err, data) {
            delete user.pwd;
            res.send(user)
        })

    })
}