var ObjectId = require('mongodb').ObjectID

module.exports = function(app){
	app.post('/register', function (req, res) {
		if (!req.body.email) {
			res.status(400).send({ message: "Email is required" })
			return;
		} else if (!req.body.nick) {
			res.status(400).send({ message: "Nick is required" })
			return;
		} else if (!req.body.pwd || !req.body.repeatPwd || req.body.pwd != req.body.repeatPwd) {
			res.status(400).send({ message: "Passwords do not match" })
			return;
		}

		UsersCollection.find({}).toArray(function (err, users) {
			var emailExists = false;
			var nickExists = false;
			_.some(users, function (user) {
				emailExists = (user.email == req.body.email);
				nickExists = (user.nick == req.body.nick);
				return emailExists || nickExists;
			});

			if (emailExists) {
				res.status(400).send({ message: "User with this email already exists" });
			} else if (nickExists) {
				res.status(400).send({ message: "User with this nick already exists" });
			} else {
				var user = {
					email: req.body.email,
					nick: req.body.nick,
					pwd: require('crypto').createHash('md5').update(req.body.pwd).digest('hex'),
				};
				UsersCollection.insert(user, function (err, user) {
					delete user.pwd;
					res.send(user);
				})
			}
		});
	})

	app.put('/me', function (req, res) {
		if (req.body.nick || req.body.id) {
			res.status(403).send({ message: "You cannot change your Nick and/or ID" });
			return;
		}
		req.currentUser = {
			email: req.body.email || req.currentUser.email,
			nick: req.currentUser.nick,
			pwd: req.body.pwd ? require('crypto').createHash('md5').update(req.body.pwd).digest('hex') : req.currentUser.pwd
		};
		UsersCollection.update({ nick: req.currentUser.nick }, req.currentUser, function (err, user) {
			UsersCollection.find({ nick: req.currentUser.nick }).toArray(function (err, data) {
				if (data.length == 0) {
					res.status(401).send({ message: "Invalid user" });
					return;
				}
				res.send(data[0]);
			});
		});
	})

	app.get('/me', function (req, res) {
		res.send(req.currentUser);
    })

	app.get('/user', function (req, res) {
		UsersCollection.find({}).toArray(function (err, users) {
			res.send(users.map(function (user) {
				delete user.pwd;
				return user;
			}));
		});
	})

	app.get('/user/:id', function (req, res) {
		UsersCollection.findOne({ _id: new ObjectID(req.params.id) },
			function (err, user) {
				if (!user) {
					res.status(404).send({ message: "Invalid user ID" });
					return;
				} 
				delete user.pwd;
				res.send(user);
		});
    })
}