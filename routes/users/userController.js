const bcrypt = require('bcryptjs')
const User = require('./User')
const jwt = require('jsonwebtoken');
module.exports = {


    createUser: async (req, res) => {

        try{

            let createdUser = new User({
                email: req.body.email,
                password: req.body.password
            })

            let genSalt =  await bcrypt.genSalt(12);
            let hashedPassword =  await bcrypt.hash(createdUser.password, genSalt)

            createdUser.password = hashedPassword;

            await createdUser.save()

            res.json({
                message: "user created"
            })

        } 
        catch (e) {
            
                res.status(404).json({
                    message: "Email is duplicate"
                })
            
            
           

        }
    },

    signIn: async (req, res) => {
  
        try{
            console.log(req.body)
            let foundEmail = await User.findOne({email: req.body.email})

        
            if(!foundEmail){

                throw {message: "user not found ", status: 409} 
            } else {
                let comparedPassword = await bcrypt.compare(req.body.password, foundEmail.password)

                if(!comparedPassword){
                    throw {message: "incorrect password", status: 401}
                    
                }
            }
            
            const token =  jwt.sign({email: foundEmail.email, _id: foundEmail._id}, "hamsteroverlord007", {expiresIn: "1h"})
            console.log(token);
            
        }
        catch (e) {
            console.log(e);
            if(e.status === 409 ){
                res.status(e.status).json({message: e.message})
            }else if (e.status === 401){
                res.status(e.status).json({message: e.message})
            } else {res.status(500).json({message: "something went wrong"})
            
            }

        }
    }


}