var ObjectId = require('mongodb').ObjectID
module.exports=function(app){

    app.post('/user/:id/wall',function(req,res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content:req.body.content,
            authorId:{$ref:"users",_id:req.currentUser._id},
            ownerId:{$ref:"users",_id:req.params.id}
        };
        DB.collection('posts').insert(post,function(err,data){
            res.send(data);
        })


    })

}