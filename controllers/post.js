
var ObjectId = require('mongodb').ObjectID
module.exports=function(app){

    app.get('/post', function(req, res) {
        DB.collection('posts').find({}).toArray(function (err, data) {
            if(!data || data == []) {
                res.status(400).send("There is no posts")
            }
            res.send(data);
        })
    })

    app.post('/user/:id/wall',function(req,res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content:req.body.content,
            authorId:{$ref:"users",_id:req.currentUser._id},
            ownerId:{$ref:"users",_id:req.params.id}
        };
        DB.collection('posts').insert(post,function(err,data){
            res.send(data);
        })
    })

    app.get('/user/:id/wall',function(req,res){
        var posts = [];
        DB.collection('posts').find({"ownerId._id": req.params.id}, function (err, post) {
            posts.push(post)
        })
        res.send(posts)
    })

    app.get('/post/:id', function(req, res) {
        DB.collection('posts').findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                }
                res.send(post);
            })
    })

    app.put('/post/:id', function(req, res) {                             //не сохран€ютс€ изменени€
        DB.collection('posts').findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                }

                if(post.authorId._id.toString() == req.currentUser._id.toString()) {
                    post.content = req.body.content;

                    DB.collection('posts').update({_id: new ObjectId(req.params.id)}, {$set:{"content": post.content}}
                        , function() {
                        res.send(post);
                    })
                    return
                } else {
                    res.status(404).send({message: "You can't modify post"})
                }
            })
    })

    app.delete('/post/:id', function(req, res) {

        DB.collection('posts').findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                }

                if(post.ownerId._id.toString() != req.currentUser._id && post.authorId._id.toString() != req.currentUser._id) {
                    res.status(403).send({message: "You can't delete post"})
                    return
                }
            })


         DB.collection('posts').remove({_id: new ObjectId(req.params.id)}, function(err, data) {
             res.send(data)
         })

    })

}