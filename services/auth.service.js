const {Photo} = require('../models');
const { validationResult } = require('express-validator');
const {User} = require('../models');
const jwt = require('jsonwebtoken');
const argon = require('argon2');
const CustomError = require('../errors');
const multer  = require('multer');
// const upload = multer();
const fs = require('fs');
const {  randFirstName , randLastName, randFullName, randEmail, randPassword } = require('@ngneat/falso');
const path = require('path');



class BaseService {


    storage = multer.diskStorage({
             destination: (req, file, cb) => {
                 cb(null, '../images')
            },
            filename: (req, file, cb) => {
                //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                const {originalName} = file
                cb(null, originalName )
             }
    })
      
    upload = multer({ storage: this.storage })


    async signUp (req, res) {

        let errors = validationResult(req);
        if(!errors.isEmpty()){
            errors = errors.array()
            res.send(errors)
        }else{
            // try{
            //     const hash = await argon.hash(req.body.password);
            //     const user = await User.create({
            //         firstName:req.body.firstName, 
            //         lastName:req.body.lastName, 
            //         nickName:req.body.nickName?req.body.nickName:'',
            //         email:req.body.email, 
            //         password:hash,     
            //     });
            //     res.send({msg:'user created', name:user.firstName, surname:user.lastName})
            // }catch(err){
            //     console.log(err)
            // }

            try{

                const fakeUser = {
                    firstName: randFirstName(), 
                    lastName:randLastName(),
                    nickName:randFullName(),
                    email: randEmail(), 
                    //password:randPassword()
                };

                //console.log("fake pass", fakeUser.password)

                const hash = await argon.hash(req.body.password);
                const user = await User.create({
                    firstName:fakeUser.firstName, 
                    lastName:fakeUser.lastName, 
                    nickName:fakeUser.nickName,
                    email:fakeUser.email, 
                    password:hash,     
                });

               // console.log(user)
                res.send({msg:'user created', name:user.firstName, surname:user.lastName})
            }catch(error){
                console.log(error)
                throw error;
            }
        }

    };


    async login(req, res) {
        try{
            const user = await User.findOne({where:{email:req.body.email}});
            if(!user){
                throw `there is no such user with that email`       
            }else{
                const matches = await argon.verify(user.password, req.body.password);
                if(matches){
                   const accessToken = jwt.sign({email:user.email, userId:user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"240000s"})
                   return accessToken
                }else{
                    res.send('incorrect password')
                }
            }
        
        }catch(error){
            console.log(error)
            throw error;
        }    
    }


    async uploadFile (req, res) {
        const {userId} = req.user;
        const {filename} = req.file
        try{
            const addingPhoto = await Photo.create({userId, url:filename});
            return addingPhoto  
        }catch(error){
            throw(error)
        }

    }

}



module.exports = new BaseService
