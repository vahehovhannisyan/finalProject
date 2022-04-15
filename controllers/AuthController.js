const BaseService = require('../services/auth.service');

const  register = async (req, res, next) => { 

    try{
        await BaseService.signUp(req, res);
        res.send("success")
    }catch(error){
        next(error)
    }

};


const  login = async (req, res, next) => {
    try{
        const token = await BaseService.login(req, res);
        res.send({token})
    }catch(error){
        next(error)        
    }
};


const upload = async(req, res, next) => { 

    try{
        const photo = await BaseService.uploadFile(req, res)
        res.send({msg:'succees', photo})
    }catch(error){
        next(error)         
    }
}


module.exports = {register, login, upload};
