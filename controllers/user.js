var uniqueId = Date.now();
module.exports = function(app){
    app.get('/me',function(req, res) {
        if(!req.currentUser) {
            res.status(404).send({message:"not found"})
            return;
        }

        res.send(req.currentUser);
    })

    app.put('/me', function(req, res){
        if(req.currentUser.nick != req.body.nick && req.body.nick) req.currentUser.nick = req.body.nick
        if(req.currentUser.pwd != req.body.pwd && req.body.pwd) req.currentUser.pwd = req.body.pwd
        if(req.currentUser.email != req.body.email && req.body.email) req.currentUser.email = req.body.email
        DB.save();
        res.send(req.currentUser)
    })

    app.get('/user', function (req, res) {
        if(!DB.users || DB.users == []) {
            res.status(400).send("There is no posts")
        }
        res.send(DB.users);
    })
    app.get('/user/:id',function(req, res){
        var user = _.clone(_.find(DB.users,function(usr){
            return usr.id ==req.params.id;
        }));
        delete user.pwd;
        if(!user){
            res.status(404).send({message:"not found"})
            return;
        }
        res.send(user)
    })

    app.get('/user/:id/wall',function(req, res) {
       res.send(_.where( DB.posts,{ownerId:req.params.id}));
    })

    app.post('/user/:id/follow', function(req, res) {
        if(_.find(req.currentUser.follow, function(followingId) {
                return req.params.id == followingId;
            })) {
            res.status(400).send('There is such user in follows already OR you can\'t follow he/she')
            return;
        }

        if(!req.currentUser.follow)  req.currentUser.follow = []

        req.currentUser.follow.push(req.params.id);
        DB.save();
        res.send(req.currentUser.follow)
    })

    app.get('/user/:id/followers', function(req, res) {
        var followers = [];

        _.each(DB.users, function(index, i, arr) {
            _.each(index.follow, function(item, j, array) {
                if(item == req.params.id) followers.push(index.id)
            })
        })
        if(!followers) {
            res.status(400).send('The is no followers')
            return
        }
        res.send(followers)
    })

    app.get('/user/:id/following', function(req, res) {
        res.send(req.currentUser.follow)
    })

    app.delete('/user/:id/follow', function(req, res) {
        if (!_.find(req.currentUser.follow, function(index, i, arr) {
                return index == req.params.id
            })) {
            res.status(400).send('The is no such user in follows')
            return;
        }

        var id = (function(array) {
            for(var i = 0; i < array.length; i++) {
                if(req.params.id == array[i]){
                        return i;
                }
            }
        })(req.currentUser.follow);
        console.log(id)
        req.currentUser.follow.splice(id, 1);
        DB.save();
        res.send(req.currentUser.follow);
    })

    app.post('/register', function (req, res) {
        //проверить свободен ли ник и имейл
        if (!req.body.email) {
            res.status(400).send({message: "Email is required"})
            return;
        } else if (!req.body.nick) {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if (!req.body.pwd || !req.body.repeatPwd || req.body.pwd != req.body.repeatPwd) {
            res.status(400).send({message: "Passwords do not match"})
            return;
        } else if(_.where(DB.users, {nick : req.body.nick}).length > 0) {
            console.log(_.where(DB.users, {nick : req.body.nick}))
            res.status(400).send({message: "There is such nick"})
            return;
        } else if(! (req.body.pwd.length > 6 && /[A-Z]/.test(req.body.pwd) && ! /^[a-zA-Z0-9- ]*$/.test(req.body.pwd)) ) {
            res.status(400).send({message: "a password must be six characters including one uppercase letter, one " +
            "special character and alphanumeric characters."})
            return;
        }

        var user = {
            email: req.body.email,
            nick: req.body.nick,
            pwd: sha1(req.body.pwd),
            id: ++uniqueId
        };

        DB.users.push(_.clone(user))
        DB.save();
        delete user.pwd;
        res.send(user)
    })
}