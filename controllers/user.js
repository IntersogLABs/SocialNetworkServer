var uniqueId = Date.now();
module.exports = function(app){
    app.get('/me',function(req,res){
        res.send(req.currentUser);
    })
    app.get('/user', function (req, res) {
        res.send(DB.users);
    })
    app.get('/user/:id',function(req,res){
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
    app.get('/user/:id/wall',function(req,res){
       res.send(_.where( DB.posts,{ownerId:req.params.id}));
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
        }
        var user = {
            email: req.body.email,
            nick: req.body.nick,
            pwd: req.body.pwd,
            id: ++uniqueId
        };

        DB.users.push(_.clone(user))
        DB.save();
        delete user.pwd;
        res.send(user)
    })
}