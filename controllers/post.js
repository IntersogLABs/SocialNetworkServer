var ObjectId = require('mongodb').ObjectID
module.exports=function(app){

    app.post('/user/:id/wall',function(req,res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content:req.body.content,
            authorId:{$ref:"users",_id:req.currentUser._id},
            ownerId:{$ref:"users",_id:new ObjectId(req.params.id)}
        };
        DB.collection('posts').insert(post,function(err,data){
            res.send(data);
        })


    })

    app.get('/post',function(req,res){
        DB.collection('posts').find({}).toArray(function (err, data) {
		res.send(data);
	})
    })

    app.get('/posts/:id', function (req, res) {
        DB.collection('posts').findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                }
                res.send(post);
            })
    })

    app.put('/posts/:id', function (req, res) {
        var PostsCollection = DB.collection('posts');
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }

        PostsCollection.findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                } else if (!post.authorId._id.equals(req.currentUser._id)) {
		    res.status(403).send({message: "not allowed"})
		    return;
		}

		PostsCollection.updateOne({_id: post._id},
		    {$set: {content: req.body.content}},
		    function(err, result) {
			res.send(result);
		    })
	    })
    })

    app.delete('/posts/:id', function (req, res) {
        var PostsCollection = DB.collection('posts');
        PostsCollection.findOne({_id: new ObjectId(req.params.id)},
            function (err, post) {
		var _id = req.currentUser._id;
                if (!post) {
                    res.status(404).send({message: "not found"})
                    return;
                } else if (!post.authorId._id.equals(_id) && !post.ownerId._id.equals(_id)) {
		    res.status(403).send({message: "not allowed"})
		    return;
                }

		PostsCollection.deleteOne({'_id': post._id},
		    function(err, result) {
			res.send(result);
		    })
            })
    })
}
