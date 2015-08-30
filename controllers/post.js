module.exports = function(app){

    app.post('/user/:id/wall', function(req, res){
        
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content: req.body.content,
            authorId: {$ref: "users", $id: req.currentUser._id},
            ownerId: {$ref: "users", $id: new ObjectID(req.params.id)}
        };

        PostsCollection.insert(post, function(err, data){
            res.send(post);
        })
    })

    app.get('/posts', function(req, res){
        
        PostsCollection
            .find({})
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

    app.get('/posts/:id', function(req, res){
       PostsCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, post){
            if(!post){
                res.status(404).send({message:"not found"})
                return;
            }
            UsersCollection.findOne({_id: post.authorId.oid}, function(err, data){
                post.author = deletePwd(data);

                UsersCollection.findOne({_id: post.ownerId.oid}, function(err, data){
                    post.owner = deletePwd(data);
                    delete post.authorId;
                    delete post.ownerId;
                    res.send(post)
                })
            })
            
        })
    })

    app.put('/posts/:id', function(req,res){
        PostsCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, post){
            if(!post){
                res.status(404).send({message:"not found"})
                return;
            }
            if(req.currentUser._id.toString() != post.authorId.oid.toString()){
                res.status(405).send({message: "Not Allowed"})
                return;
            }
            if(!req.body.content){
                res.status(400).send({message:'content required'})
            return;
            }
            
            PostsCollection.update(
                {_id: post._id},
                {$set: {content: req.body.content}},
                function(err, data){
                    post.content = req.body.content
                    res.send(post)    
                }
            )
        })
    })

    app.delete('/posts/:id', function(req, res){
        PostsCollection.findOne({_id: new ObjectID(req.params.id)}, function(err, post){
            if(!post){
                res.status(404).send({message:"not found"})
                return;
            }
            if(!(req.currentUser._id.toString() == post.authorId.oid.toString() || req.currentUser._id.toString() == post.ownerId.oid.toString())){
                res.status(405).send({message: "Not Allowed"})
                return;
            }  
            PostsCollection.remove({_id: new ObjectID(req.params.id)}, function(err, post){
               res.send("deleted") 
            })
            
        })
       
    })

}