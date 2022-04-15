class BaseModel {

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


module.exports = new BaseModel