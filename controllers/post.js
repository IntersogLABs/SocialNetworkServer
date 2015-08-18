module.exports=function(app){
    app.post('/user/:id/wall',function(req,res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content:req.body.content,
            id:Date.now(),
            authorId:req.currentUser.id,
            ownerId:req.params.id
        };
        DB.posts.push(post)
        DB.save();
        res.send(post);
    })

    app.get('/post', function(req, res) {
        if(!DB.posts || DB.posts == []) {
            res.status(400).send("There is no posts")
        }

        res.send(DB.posts);
    })

    app.get('/post/:id', function(req, res) {
        var post = _.find(DB.posts,function(post){
            return post.id ==req.params.id;
        });
        if(!post){
            res.status(404).send({message:"not found"})
            return;
        }
        res.send(post)
    })

    app.put('/posts/:id', function(req, res) {
        var post = _.where( DB.posts,{id:req.params.id});

        if(!post) {
            res.status(404).send({message:"not found"})
            return;
        }

        if(req.currentUser.id == post.authorId) {
            post.content = req.body.content
            res.send(DB.posts[req.params.id])
            return;
        }
        res.status(400).send('You can\'t edit this post')
    })

    app.delete('/post/:id', function(req, res) {
        var id = _.where( DB.posts, {id:req.params.id});

        if(!id) {
            res.send("There is no such post")
            return;
        }

        if(!(req.currentUser.id == DB.posts[id].authorId || req.currentUser.id == DB.posts[id].ownerId)) {
            res.status(400).send('You can\'t delete this post')
            return;
        }

        DB.posts.splice(id, 1);
        DB.save();
        res.send(DB.posts)
    })

}