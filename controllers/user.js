var uniqueId = Date.now();

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
		} else if (_.some(DB.users, function (usr) { return usr.nick == req.body.nick; })) {
			res.status(400).send({ message: "User with this nick already exists" });
			return;
		} else if (_.some(DB.users, function (usr) { return usr.email == req.body.email; })) {
			res.status(400).send({ message: "User with this email already exists" });
			return;
		}
		var user = {
			email: req.body.email,
			nick: req.body.nick,
			pwd: req.body.pwd,
			id: uniqueId
		};

		DB.collection('users').insert(user, function (err, user) {
			delete user.pwd;
			res.send(user);
		})
	})

	app.put('/me', function (req, res) {
		if (req.body.nick || req.body.id) {
			res.status(403).send({ message: "You cannot change your Nick and ID" });
			return;
		}
		req.currentUser = {
			email: req.body.email || req.currentUser.email,
			nick: req.currentUser.nick,
			pwd: req.body.pwd || req.currentUser.pwd,
		};
		DB.collection('users').update({ nick: req.currentUser.nick }, req.currentUser, function (err, user) {
			if (user.lenght = 0) {
				res.status(401).send({ message: "Invalid user or password" })
				return;
			} else {
				delete user.pwd;
				res.send(user);
			}
		});
	})

	app.get('/me', function (req, res) {
		res.send(req.currentUser);
    })

	app.get('/user', function (req, res) {
		DB.collection('users').find({}).toArray(function (err, users) {
			res.send(users);
		});
	})

	app.get('/user/:id', function (req, res) {
		DB.collection('users').find({ _id: new ObjectID(req.params.id) }).toArray(function (err, user) {
			if (user.lenght = 0) {
				res.status(401).send({ message: "Invalid user or password" })
				return;
			} else {
				delete user.pwd;
				res.send(user);
			}
		});
    })
}