const {Post} = require('../models');
const { randText } = require('@ngneat/falso');
const {BaseService} = require('../services/favouritePosts.service');
const  Sequelize  = require('sequelize');
const Op = Sequelize.Op;

class  PostController {

        async createPost (req, res) {
            const {userId} = req.user;
            const {post} = req.body;
            try {
                const createdPost = await Post.create({userId, post})
                res.send({msg:'post created', post:createdPost.post, postId:createdPost.id})
            }catch(err){
                console.log(err)
            }

            // try {

            //     const fakePost = randText({length:3})
            //     fakePost.forEach(elm => {
            //         Post.create({userId:req.user.id,  post:elm})
            //     });
                
            // }catch(err){
            //     console.log(err)
            // }
        };

        async getPosts (req, res) {

            const {userId} = req.user;
            try {
                const posts = await Post.findAll({limit:10, offset:0, order: [['createdAt', 'DESC']], where:{userId}});
                let recentPosts = [];
                // posts.forEach(elm => {
                //     //  recentPosts.push(elm.post)
                //     recentPosts.push({post:elm.post, id:elm.id})
                // });
                // res.send(recentPosts); 
                res.json(posts)     
            }catch(err){
                console.log(err)
            }   
        };

        async showMorePosts (req, res) {  
            const {userId} = req.user;
            const {value} = req.query;
            try {
                const morePosts = await Post.findAll({limit:10, offset:value, order: [['createdAt', 'DESC']], where:{userId}});
                let recentPosts = [];
                morePosts.forEach(elm => {
                    //  recentPosts.push(elm.post)
                    recentPosts.push({post:elm.post, id:elm.id})
                });
                res.send(recentPosts);      
            }catch(err){
                console.log(err)
            } 


        }

        async updatePost (req, res) {
            const {id} = req.params;
            const {post} = req.body;
            try {
                const postToUpdate = await Post.findOne({where:{id}});
                if(postToUpdate == null){
                    res.send(`post with id ${id} does not exist`)
                }else{
                    await Post.update({post}, {where:{id}});
                    const updatedPost = await Post.findOne({where:{id}, attributes:['id', 'post', 'userId']});
                    res.send({msg:'post updated', updatedPost});   
                }
                    
            }catch(err){
                return {msg:err}
            }
        };

        async deletePost (req, res) {
            const {userId} = req.user;
            const {id} = req.params;
            try {
                const postToDelete = await Post.findOne({where:{id, userId}});
                if(postToDelete == null){
                    res.send(`post with id ${id} can not be deleted or already deleted`)
                }else{     
                    await Post.destroy({where:{id}});
                    res.send({msg:`post with id ${id} deleted`})               
                }
            } catch (err) {
                return {msg:err}
            }    
        };


        async searchPost (req, res) {
            const {searchData} = req.query;
            try {
                let allFindedPosts = [];
                const findedData = await Post.findAll({ where: {post: { [Op.like]: searchData + '%'  } } }); 
                if(findedData.length > 0){
                    findedData.forEach(elm => {
                        allFindedPosts.push(elm.dataValues.post);     
                    });
                    res.send({msg:'founded posts', allFindedPosts})
                }else{
                    res.send('nothing found')
                }                
            }catch(err){
                return {msg:err}
            }
        };


}

module.exports = new PostController


