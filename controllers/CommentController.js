const {Comment} = require('../models');
const {Post} = require('../models');
// const { randText } = require('@ngneat/falso');


class CommentController {

    async createComment (req, res) { 
        const {userId} = req.user;
        const {postId} = req.params;
        const {comment} = req.body;
        try {
            const createdComment  = await Comment.create({
                userId, 
                postId, 
                comment
            });
            res.send({msg:'comment created', comment:createdComment.comment})
        }catch(err){
           res.send(err)
        }


        // try {
        //     const fakeComment = randText({ length: 10 });
        //     fakeComment.forEach(elm => {
        //         Comment.create({userId:req.user.id, postId:req.body.postId, comment:elm})
        //     });
        // }catch(err){
        //     console.log(err)
        // }
       
    };


    async getComments (req, res) {
        const {postId} = req.params;
        try {
            const post = await Post.findOne({where:{id:postId}});
            if(post == null) {   
                res.send(`post with id ${postId} does not exist`)
            }else{
                const comments = await Comment.findAll({limit:5, offset:0, order: [['createdAt', 'DESC']], where:{postId}});
                // let recentComments = [];
                // comments.forEach(elm => {
                //     //  recentPosts.push(elm.post)
                //     recentComments.push({id:elm.id, comment:elm.comment})
                // });
                res.send(comments); 
            }         
        }catch(err){
            console.log(err)
        }   

    };


    async showMoreComments (req, res) {  
        const {postId} = req.params;
        const {value} = req.query;
        try {
            const post = await Post.findOne({where:{id:postId}});
            if(post == null) {   
                res.send(`post with id ${postId} does not exist`)
            }else{
                const comments = await Comment.findAll({limit:5, offset:value, order: [['createdAt', 'DESC']], where:{postId}});
                let recentComments = [];
                comments.forEach(elm => {
                    //  recentPosts.push(elm.post)
                    recentComments.push({id:elm.id, comment:elm.comment})
                });
                res.send(recentComments); 
            }         
        }catch(err){
            console.log(err)
        }   
     

    }
}

module.exports = new CommentController