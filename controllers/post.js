module.exports=function(app){

	app.get('/user/:id/wall', function (req, res) {
		res.send(_.where(DB.posts, { ownerId: +req.params.id }));
	})

	app.post('/user/:id/wall', function (req, res) {
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content: req.body.content,
            authorId: { $ref: "users", _id:new ObjectID(req.currentUser.id)},
        	ownerId: { $ref: "users", _id:new ObjectID(+req.params.id)}
        };
        DB.collection('posts').insert(post, function (err, data) {
        	res.send(post);
        })
    })

	app.get('/post', function (req, res) {
		res.send(DB.posts);
		return;
	})

	app.get('/posts/:id', function (req, res) {
		res.send(_.where(DB.posts, { id: +req.params.id }));
		return;
	})

	app.put('/posts/:id', function (req, res) {
		var index = -1;
		var postFound;
		var found = _.some(DB.posts, function (post, i) {
			var isFound = (req.params.id == post.id);
			if (isFound) {
				index = i;
				postFound = _.clone(post);
			}
			return isFound;
		})
		if (!found) {
			res.status(404).send({ message: "Post not found" });
			return;
		}
		if (postFound.authorId != req.currentUser.id) {
			res.status(403).send({ message: "You cannot change this post" });
			return;
		}
		if (req.body.id || req.body.authorId || req.body.ownerId) {
			res.status(403).send({ message: "You can change content only" });
			return;
		}
		postFound.content = req.body.content;
		DB.posts[index] = postFound;
		DB.save();
		res.send(postFound);
	})

	app.delete('/posts/:id', function (req, res) {

		var index = -1;
		var found = _.some(DB.posts, function (item, i) {
			var isFound = (item.id == req.params.id);
			if (isFound) index = i;
			return isFound;
		})
		if (!found) {
			res.status(404).send({ message: "Post not found" });
			return;
		}
		var post = _.clone(DB.posts[index]);
		console.log(index, found, post);
		if (req.currentUser.id != post.authorId && req.currentUser.id != post.ownerId) {
			res.status(403).send({ message: "Privilege violation" });
			return;
		}

		DB.posts.splice(index, 1);
		DB.save();
		res.send({ message: "Following post has been deleted:", "post": post })
	})
}