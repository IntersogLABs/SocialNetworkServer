module.exports=function(app){
    app.post('/user/:id/wall',function(req,res){
        if(!req.body.content){
            res.status(400).send({message:'content required'})
            return;
        }
        var post = {
            content:req.body.content,
            id:Date.now(),
            authorId:req.currentUser.id,
            ownerId:req.params.id
        };
        DB.posts.push(post)
        DB.save();
        res.send(post);
    })

}