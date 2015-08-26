
module.exports = function (app) {

	app.get('/user/:id/wall', function (req, res) {
		PostsCollection.find({ ownerId: req.params.id.toString() }).toArray(function (err, posts) {
			if (posts.length == 0) {
				res.status(404).send({ message: "Not found" });
				return
			}
			res.send(posts);
		});
	})

	app.post('/user/:id/wall', function (req, res) {
        if(!req.body.content){
            res.status(400).send({message:'Content required'})
            return;
        }

        var post = {
            content: req.body.content,
            authorId: req.currentUser._id.toString(),				//{ $ref: "users", _id: new ObjectID(req.currentUser.id)},
            ownerId: req.params.id.toString()					//{ $ref: "users", _id: new ObjectID(req.params.id)}
        };
        console.log(post);
        PostsCollection.insert(post, function (err, data) {
        	res.send(data);
        })
    })

	app.get('/post', function (req, res) {
		PostsCollection.find({}).toArray(function (err, posts) {
			if (posts.length == 0) {
				res.status(404).send({ message: "Not found" });
				return;
			}
			res.send(posts);
		});
	})

	app.get('/posts/:id', function (req, res) {
		PostsCollection.find({ _id: new ObjectID(req.params.id) }).toArray(function (err, posts) {
			if (posts.length == 0) {
				res.status(404).send({ message: "Not found" });
				return
			}
			res.send(posts[0]);
		});
	})

	app.put('/posts/:id', function (req, res) {
		PostsCollection.find({ _id: new ObjectID(req.params.id) }).toArray(function (err, posts) {
			if (posts.length == 0) {
				res.status(404).send({ message: "Post not found" });
				return;
			}
			if (posts[0].authorId != req.currentUser._id.toString()) {
				res.status(403).send({ message: "Privilege violation" });
				return;
			}
			if (req.body.id || req.body.authorId || req.body.ownerId) {
				res.status(403).send({ message: "You can change content only" });
				return;
			}
			if (!req.body.content) {
				res.status(404).send({ message: "New content not found" });
				return;
			}
			posts[0].content = req.body.content;
			PostsCollection.update({ _id: new ObjectID(req.params.id) }, posts[0], function (err, answer) {
				res.send(answer);
			});
		});
	})

	app.delete('/posts/:id', function (req, res) {
		var currentUserID = req.currentUser._id.toString();
		PostsCollection.find({ _id: new ObjectID(req.params.id) }).toArray(function (err, posts) {
			if (posts.length == 0) {
				res.status(404).send({ message: "Post not found" });
				return;
			}
			if (posts[0].authorId != currentUserID && posts[0].ownerId != currentUserID) {
				res.status(403).send({ message: "Privilege violation" });
				return;
			}
			PostsCollection.remove({ _id: new ObjectID(req.params.id) }, function (err, answer) {
				res.send(answer);
			})
		});
	})
}