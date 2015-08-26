
module.exports = function (app) {

	app.post('/user/:id/follow', function (req, res) {
		UsersCollection.findOne({ _id: new ObjectID(req.params.id) },
			function (err, user) {
				if (!user) {
					res.status(404).send({ message: "Invalid user ID" });
					return;
				}
				var follow = {
					follower: req.currentUser._id.toString(),
					following: user._id.toString()
				};
				FollowCollection.findOne(follow, function (err, flw) {
						if (flw) {
							res.status(403).send({ message: "You are following this user already" });
							return;
						}
						FollowCollection.insert(follow, function (err, data) {
							res.send(data);
						})
					})
			});
	})

	app.get('/user/:id/following', function (req, res) {
		UsersCollection.findOne({ _id: new ObjectID(req.params.id) },
			function (err, user) {
				if (!user) {
					res.status(404).send({ message: "Invalid user ID" });
					return;
				}
				FollowCollection.find({ follower: req.params.id.toString() }).toArray(function (err, flw) {
					if (flw.length === 0) {
						res.status(422).send({ message: "This user does not follow anybody" });
						return;
					}
					var result = flw.map(function(item){
						item = item.following;
						return item;
					})
					res.send(result);
				})
			});
	})

	app.get('/user/:id/followers', function (req, res) {
		UsersCollection.findOne({ _id: new ObjectID(req.params.id) },
			function (err, user) {
				if (!user) {
					res.status(404).send({ message: "Invalid user ID" });
					return;
				}
				FollowCollection.find({ following: req.params.id.toString() }).toArray(function (err, flw) {
					if (flw.length === 0) {
						res.status(422).send({ message: "Nobody is following this user" });
						return;
					}
					var result = flw.map(function (item) {
						item = item.follower;
						return item;
					})
					res.send(result);
				})
			});
	})

	app.delete('/user/:id/follow', function (req, res) {
		UsersCollection.findOne({ _id: new ObjectID(req.params.id) },
			function (err, user) {
				if (!user) {
					res.status(404).send({ message: "Invalid user ID" });
					return;
				}
				var follow = {
					follower: req.currentUser._id.toString(),
					following: user._id.toString()
				};
				FollowCollection.findOne(follow, function (err, flw) {
					if (!flw) {
						res.status(404).send({ message: "You are not following this user" });
						return;
					}
					FollowCollection.remove(flw, function (err, data) {
						res.send(data);
					})
				})
			});
	})
}