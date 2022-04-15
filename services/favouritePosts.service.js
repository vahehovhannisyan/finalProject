const {FavouritePost, Post} = require('../models');
const CustomError = require('../errors');
const  Sequelize  = require('sequelize');
const Op = Sequelize.Op;

class BaseService {

      async findAll (user) {
            const {userId} = user;
            try {
                  const favPosts = await FavouritePost.findAll({where:userId});
                  if (!favPosts.length) {
                     throw new CustomError.NotFoundError(`There is not favorite post for search`);
                  }
                  let indexes = [];
                  favPosts.forEach( (elm) => {
                     indexes.push(elm.postId)
                  });
                  const posts = await Post.findAll( 
                     { where: { id : { [Op.or]: indexes} },      
                  });
                  if(!posts.length) {
                     throw new CustomError.NotFoundError(`There is not post for search`);
                  }
                  return posts;
            } catch (error) {
                  throw error;
            }
      };

      async addToFavourites (user, post) {
            const {userId} = user;
            const {postId} = post;
            try {
                  const postExists = await Post.findOne({where:{id:postId}});
                  if(postExists == null){
                     throw new CustomError.NotFoundError('Post does not exist')   
                  }else{
                     const postIsFavourite = await FavouritePost.findOne({where:{userId, postId}});
                     if(postIsFavourite == null){
                     await FavouritePost.create({userId, postId});
                     }else{
                     throw new CustomError.BadRequestError('Post is already added to favourites')   
                     } 
                  }                  
            } catch(err){
                  throw(err)           
            }     
      };

      async removeFromFavourites (user, post) {
            const {userId} = user;
            const {postId} = post;
            try{
               const postIsFavourite = await FavouritePost.findOne({where:{userId, postId}});
               if(postIsFavourite == null){
                  throw new CustomError.BadRequestError(`post does not exist`) 
               }else{
                  await postIsFavourite.destroy()
               }
            }catch(error){
               throw error
            }
      };

      async getPosts (user, data) {
            const {userId} = user;
            const {limit, offset} = data;
            try {
                  const favPosts = await FavouritePost.findAll({limit, offset, order: [['createdAt', 'DESC']], where:{userId}});
                  if (!favPosts.length) {
                     throw new CustomError.NotFoundError(`There are not posts for search`);
                  }else{
                     let indexes = [];
                     favPosts.forEach( (elm) => {
                        indexes.push(elm.postId)
                     });
                     const posts = await Post.findAll( 
                        { where: { id : {[Op.or]: indexes} },      
                     })

                     if(!posts.length){
                        throw new CustomError.NotFoundError(`There are no posts`);
                     }else{
                        return posts
                     }
                  }         
            }catch(error){
               throw error
            }
      };


      async search(user, data) {
            const {userId} = user;
            const {text} = data;
            try{
               //const findedData = await FavouritePost.findAll({ where: {post: { [Op.like]: searchData + '%'  } } });
               // let favPosts = await FavouritePost.findAll({
               //    where:{
               //       userId
               //    },
               //    // include:{
               //       // model:User,
               //       // as:'post',
               //       // where:{
               //       //    id:{
               //       //       [Op.or]: [222,223]
               //       //    }
               //       // }
               //    // }
               //    // include: {
               //    //    "usres":  Sequelize.literal(`( SELECT * FROM users WHERE id = ${userId})`)
               //    // }
               // })
               let favPosts = new Promise((resolve, reject) => {
                 FavouritePost.findAll({
                        where:{
                           userId
                        }}).then(async (res) => {
                           const ids = [];
                           res.forEach(item => {
                              ids.push(item.postId)
                           })
                          const posts = await Post.findAll({
                             where: {
                                id: ids,
                                post: {
                                 [Op.like]:  `${text}%`
                                }
                             }
                          })
                          resolve(posts)
                        }).catch(e => {
                           reject(e)
                           //throw new CustomError.NotFoundError(`There are no posts`);
                        })
               })
               return favPosts 
            }catch(error){
               throw error
            }

      }

}

module.exports = new BaseService


     




