
module.exports = function(app){
    app.get('/me',function(req,res){
        res.send(deletePwd(req.currentUser));
    })

    app.put('/me',function(req, res){
        var user = _.findWhere(DB.users,{"id":req.currentUser.id});
        if (req.body.email && req.body.email=="") {
            res.status(400).send({message: "Email is required"})
            return;
        } else if (req.body.nick && req.body.nick=="") {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if ((req.body.pwd)&&(!req.body.repeatPwd || req.body.pwd != req.body.repeatPwd)){
            res.status(400).send({message: "Passwords do not match"})
            return;
        }

        var userWithEmail = _.findWhere(DB.users,{"email":req.body.email});
        var userWithNick = _.findWhere(DB.users,{"nick":req.body.nick});

        if (userWithEmail && userWithEmail.id != user.id){
            res.status(400).send({message: "This Email is not available"})
            return;
        } else if (userWithNick && userWithNick.id != user.id){
            res.status(400).send({message: "This Nick is not available"})
            return;
        }

        if (req.body.email){
            user.email = req.body.email;
        }
        if (req.body.nick){
            user.nick = req.body.nick;
        }
        if (req.body.pwd){
            user.pwd = sha1(req.body.pwd);
        }
        DB.save();
        res.send(deletePwd(user));
    })

    app.get('/user', function(req, res) {
        res.send(deletePwd(DB.users));
    })

    app.get('/user/:id', function(req, res){
        var user = _.clone(_.find(DB.users,function(usr){
            return usr.id == req.params.id;
        }));
        if(!user){
            res.status(404).send({message:"not found"})
            return;
        }
        res.send(deletePwd(user))
    })

    app.get('/user/:id/wall',function(req,res){
       res.send(_.where( DB.posts,{ownerId: req.params.id}));
    })



    app.get('/user/:id/following', function(req, res){
        var user = _.clone(_.find(DB.users,function(usr){
            return usr.id == req.params.id;
        }));

        if(!user){
            res.status(404).send({message:"not found"})
            return;
        }

        var following = _.filter(DB.users,function(usr){
            return _.include(user.follow, usr.id);
        });
        
        res.send(deletePwd(following))
    })

    app.get('/user/:id/followers', function(req, res){

        var followers = _.clone(_.filter(DB.users,function(user){
            return user.follow && _.include(user.follow, req.params.id);
        }));

        res.send(deletePwd(followers))
    })

    app.post('/user/:id/follow', function(req, res){
           
        var user = _.findWhere(DB.users, {"id": req.currentUser.id});
        user.follow = user.follow || [];
        if(!_.include(user.follow, req.params.id)){
            user.follow.push(req.params.id);
            DB.save();
        }
        res.send("following "+req.params.id)
    })

    app.delete('/user/:id/follow', function(req, res){
        var user = _.findWhere(DB.users, {"id": req.currentUser.id});
        user.follow = user.follow || [];
        user.follow = _.without(user.follow, req.params.id)
        DB.save();
        res.send("not following "+req.params.id)
    })

    app.post('/register', function(req, res) {
        
        var uniqueId = Date.now();
        console.log(req.body);
        //проверить свободен ли ник и имейл
        if (!req.body.email) {
            res.status(400).send({message: "Email is required"})
            return;
        } else if(req.body.email.indexOf("@")==-1){
             res.status(400).send({message: "Invalid Email"})
            return;
        } else if (!req.body.nick || req.body.nick == "") {
            res.status(400).send({message: "Nick is required"})
            return;
        } else if (!req.body.pwd || !req.body.repeatPwd || req.body.pwd != req.body.repeatPwd) {
            res.status(400).send({message: "Passwords do not match"})
            return;
        }

        if (_.findWhere(DB.users,{"email":req.body.email})){
            res.status(400).send({message: "This Email is not available"})
            return;
        } else if (_.findWhere(DB.users,{"nick":req.body.nick})){
            res.status(400).send({message: "This Nick is not available"})
            return;
        }
        var user = {
            email: req.body.email,
            nick: req.body.nick,
            pwd: sha1(req.body.pwd),
            id: String(++uniqueId)
        };

        DB.users.push(user)
        DB.save();
        res.send(deletePwd(user))
    })


    function deletePwd(users){
        if (_.isArray(users)){
            return _.map(users, function(user){
                var userCopy = _.clone(user)
                delete userCopy.pwd;
                return userCopy;
            })
        } else {
            var userCopy = _.clone(users)
            delete userCopy.pwd;
            return userCopy;
        }
    }
}