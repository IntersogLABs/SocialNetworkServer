module.exports=function(app){
    app.post('/user/:id/wall', function(req, res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var uniqueId = Date.now();
        var post = {
            content: req.body.content,
            id: String(++uniqueId),
            authorId: req.currentUser.id,
            ownerId: req.params.id
        };
        DB.posts.push(post)
        DB.save();
        res.send(post);
    })

    app.get('/post', function(req, res){
        res.send(DB.posts);
    })

    app.get('/posts/:id', function(req, res){
       var post = _.clone(_.findWhere(DB.posts,{"id":req.params.id}));
        if(!post){
            res.status(404).send({message:"not found"})
            return;
        }
        res.send(post)
    })

    app.put('/posts/:id',function(req,res){
        var post = _.findWhere(DB.posts,{"id":req.params.id});
        if(!post){
            res.status(404).send({message:"not found"})
            return;
        }
        if(req.currentUser.id != post.authorId){
            res.status(405).send({message: "Not Allowed"})
            return;
        }
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        
        post.content = req.body.content;
        DB.save();
        
        res.send(post)
    })

    app.delete('/posts/:id', function(req, res){
        var post = _.findWhere(DB.posts,{"id":req.params.id});
        if(!post){
            res.status(404).send({message:"not found"})
            return;
        }
        if(!(req.currentUser.id == post.authorId || req.currentUser.id == post.ownerId)){
             res.status(405).send({message: "Not Allowed"})
            return;
        }
        
        DB.posts.splice(DB.posts.indexOf(post),1);
        DB.save();
        
        res.send("deleted")
    })
}