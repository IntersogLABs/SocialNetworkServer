
module.exports = function(app){
    app.get('/me',function(req,res){
        res.send(deletePwd(req.currentUser));
    })

    app.put('/me',function(req, res){
        
        if (req.body.email && req.body.email=="") {
            res.status(400).send({message: "Email is required"})
            return;
        } else if (req.body.nick && req.body.nick=="") {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if ((req.body.pwd)&&(!req.body.repeatPwd || req.body.pwd != req.body.repeatPwd)){
            res.status(400).send({message: "Passwords do not match"})
            return;
        }

        var user = req.currentUser;
   
        async.parallel(
            [
                function(callback){
                    UsersCollection.findOne({email: req.body.email}, function(err,data){
                        callback(err, data)
                    })
                },
                function(callback){
                    UsersCollection.findOne({nick: req.body.nick}, function(err,data){
                        callback(err, data)
                    })
                }
            ], 
            function(err, data){
                var userWithEmail = data[0];
                var userWithNick = data[1];
              
                
                if (req.body.email && userWithEmail && userWithEmail._id.toString() != user._id.toString()){
                    res.status(400).send({message: "This Email is not available"})
                    return;
                } else if (req.body.nick && userWithNick && userWithNick._id.toString() != user._id.toString()){
                    res.status(400).send({message: "This Nick is not available"})
                    return;
                } else { 

                    if (req.body.email){
                        user.email = req.body.email;
                    }
                    if (req.body.nick){
                        user.nick = req.body.nick;
                    }
                    if (req.body.pwd){
                        user.pwd = sha1(req.body.pwd);
                    }

                    UsersCollection.update(
                        {_id: user._id}, 
                        user, 
                        function(err, data){
                            res.send(deletePwd(user)); 
                        }
                    )
                    
                }

            }
        )
    })

    app.get('/user', function(req, res) {
        UsersCollection.find({}).toArray(function(err,data){
            res.send(deletePwd(data));
        })
    })

    app.get('/user/:id', function(req, res){

        UsersCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, user){
            if(!user){
                res.status(404).send({message:"not found"})
                return;
            }
            res.send(deletePwd(user))
        })
    })

    app.get('/user/:id/wall',function(req,res){

       PostsCollection
        .find({"ownerId.$id": new ObjectID(req.params.id)})
        .toArray(function(err, posts){
            async.mapLimit(
                posts, 
                5, 
                function(post, next){
                    UsersCollection.findOne({_id: post.authorId.oid}, function(err, data){
                                       
                        post.author = deletePwd(data);

                        UsersCollection.findOne({_id: post.ownerId.oid}, function(err, data){
                            post.owner = deletePwd(data);
                            delete post.authorId;
                            delete post.ownerId;
                            next(null, post);
                        })
                    })
                }, 
                function(err, data){
                    res.send(data);
                }
            )
        })
    })

    app.get('/user/:id/following', function(req, res){
       
        UsersCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, user){
            if(!user){
                res.status(404).send({message:"not found"})
                return;
            }

            UsersCollection.find({_id: {$in: user.follow}}).toArray(function(err, data){
                           
                res.send(deletePwd(data))
            })
            
        })
    })

    app.get('/user/:id/followers', function(req, res){

        UsersCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, user){
            if(!user){
                res.status(404).send({message:"not found"})
                return;
            }

            UsersCollection.find({follow: new ObjectID(req.params.id)}).toArray(function(err,data){
                res.send(deletePwd(data))
            })
        })

        
    })

    app.post('/user/:id/follow', function(req, res){
         
         UsersCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, user){
            if(!user){
                res.status(404).send({message:"not found"})
                return;
            }

            var user = req.currentUser;
            user.follow = user.follow || [];
            var follower = _.find(user.follow, function(userId){
                return userId.toString() == req.params.id;
            })
            if (follower) { 
                res.send("already following " + req.params.id) 
                return
            }
            
            user.follow.push(new ObjectID(req.params.id));

            UsersCollection.update(
                {_id: user._id}, 
                {$set: {
                    follow: user.follow
                    }
                },
                function(err, data){
                    res.send("following " + req.params.id) 
                }
            )
        })
    })

    app.delete('/user/:id/follow', function(req, res){
        var user = req.currentUser;
        user.follow = user.follow || [];
        user.follow = _.filter(user.follow, function(userId){
            return userId.toString() != req.params.id;
        })
        
        UsersCollection.update(
            {_id: user._id}, 
            {$set: {
                follow: user.follow
                }
            },
            function(err,data){
                res.send("not following " + req.params.id)   
            }
        )
        
    })

    app.post('/register', function(req, res) {
        
        if (!req.body.email) {
            res.status(400).send({message: "Email is required"})
            return;
        } else if(req.body.email.indexOf("@") == -1){
             res.status(400).send({message: "Invalid Email"})
            return;
        } else if (!req.body.nick || req.body.nick == "") {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if (!req.body.pwd || !req.body.repeatPwd || req.body.pwd != req.body.repeatPwd) {
            res.status(400).send({message: "Passwords do not match"})
            return;
        }

        async.parallel(
            [
                function(callback){
                    UsersCollection.findOne({email: req.body.email}, function(err,data){
                        callback(err, data)
                    })
                },
                function(callback){
                    UsersCollection.findOne({nick: req.body.nick}, function(err,data){
                        callback(err, data)
                    })
                }
            ], 
            function(err, data){
                var userWithEmail = data[0];
                var userWithNick = data[1];
              
                
                if (userWithEmail){
                    res.status(400).send({message: "This Email is not available"})
                    return;
                } else if (userWithNick){
                    res.status(400).send({message: "This Nick is not available"})
                    return;
                } else { 
                    var user = {
                            email: req.body.email,
                            nick: req.body.nick,
                            pwd: sha1(req.body.pwd)
                        };

                    UsersCollection.insert(user, function(err, data){
                            res.send(deletePwd(user));
                    })
                }
            }
        )
    })

}