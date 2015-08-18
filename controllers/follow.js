module.exports = function (app) {

	app.post('/user/:id/follow',function(req,res){
		var user = _.clone(_.find(DB.users, function(usr){
			return usr.id === +req.params.id;
		}));
		if (!user) {
			res.status(404).send({ message: "User not found" })
			return;
		}
		if (_.some(DB.follow, function(flw){return flw.follower.id === req.currentUser.id && flw.following.id === user.id})) {
			res.status(422).send({ message: "You already are following this user" });
			return;
		}
		delete user.pwd;
		delete user.email;

		var currentUser = _.clone(req.currentUser);
		delete currentUser.pwd;
		delete currentUser.email;

		var follow = {
			follower: currentUser,
			following: user
		};
		DB.follow.push(follow);
		DB.save();
		res.send(follow);
	})

	app.get('/user/:id/following', function (req, res) {
		var user = _.findWhere(DB.users, { id: +req.params.id });
		if (!user) {
			res.status(404).send({ message: "User not found" })
			return;
		}
		var list = _.filter(DB.follow, function (flw) {
			return flw.follower.id == user.id;
		})
		if (!list.length) {
			res.status(422).send({ message: "This user does not follow anybody" })
			return;
		}
		var result = _.clone(_.map(list, function (item) {
			return item.following;
		}))
		res.send(result);
	})

	app.get('/user/:id/followers', function (req, res) {
		var user = _.findWhere(DB.users, { id: +req.params.id });
		if (!user) {
			res.status(404).send({ message: "User not found" })
			return;
		}
		var list = _.filter(DB.follow, function (flw) {
			return flw.following.id == user.id;
		})
		if (!list.length) {
			res.status(422).send({ message: "Nobody is following this user" })
			return;
		}
		var result = _.clone(_.map(list, function (item) {
			return item.follower;
		}))
		res.send(result);
	})

	app.delete('/user/:id/follow', function (req, res) {
		var user = _.clone(_.findWhere(DB.users, { id: +req.params.id }));
		if (!user) {
			res.status(404).send({ message: "User not found" })
			return;
		}
		var index = -1;
		var found = _.some(DB.follow, function (item, i) {
			var isFound = (item.follower.id == req.currentUser.id && item.following.id == req.params.id);
			if (isFound) index = i;
			return isFound;
		})
		if (!found) {
			res.status(422).send({ message: "You do not follow this user" })
			return;
		}

		DB.follow.splice(index, 1);
		DB.save();
		delete user.email;
		delete user.pwd;
		res.send({ message: "You are not following anymore:", "user": user });
	})

}