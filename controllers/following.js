var ObjectId = require('mongodb').ObjectID
var async = require('async')
module.exports=function(app){
    app.get('/user/:id/following',function(req,res){
        var UsersCollection = DB.collection('users')
        DB.collection('follow')
            .find({"fanId._id": new ObjectId(req.params.id)})
            .toArray(function (err, conns) {
                async.mapLimit(conns, 5, function (conn, next) {
                    UsersCollection.findOne({_id: new ObjectId(conn.idolId._id)},
                        function (err, data) {
                            conn.idol = data;
                            next(null,conn);
                        })
                }, function (err,data) {
                    res.send(data);
                })
            })
    })

    app.get('/user/:id/folowers',function(req,res){
        var UsersCollection = DB.collection('users')
        DB.collection('follow')
            .find({"idolId._id": new ObjectId(req.params.id)})
            .toArray(function (err, conns) {
                async.mapLimit(conns, 5, function (conn, next) {
                    UsersCollection.findOne({_id: new ObjectId(conn.fanId._id)},
                        function (err, data) {
                            conn.fan = data;
                            next(null,conn);
                        })
                }, function (err,data) {
                    res.send(data);
                })
            })
    })

    app.post('/user/:id/follow',function(req,res){
        var conn = {
            fanId:{$ref:"users",_id:req.currentUser._id},
            idolId:{$ref:"users",_id:new ObjectId(req.params.id)}
        };
        DB.collection('follow').insert(conn,function(err,data){
            res.send(data);
        })
    })

    app.delete('/user/:id/follow',function(req,res){
        DB.collection('follow').deleteOne({
            'fanId._id':req.currentUser._id,
            'idolId._id':new ObjectId(req.params.id)
        }, function (err,result){
            res.send(result);
        })
    })
}
