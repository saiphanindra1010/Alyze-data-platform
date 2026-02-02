import axios from "axios";
import initializeOAuthClient from "../utils/googleconfig.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"
const googleLogin=async (req,res)=>{
    try{
        const{code}=req.query;
        console.log("code "+code)
        const Oauth2client =  initializeOAuthClient();
        const googleRes=await Oauth2client.getToken(code)
        console.log("this is goole resp  "+googleRes)
        Oauth2client.setCredentials(googleRes.tokens)

        const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
   
   const {email,name}=userRes.data
   let user=await User.findOne({email});
   if(!user)
   {
    user=await  User.create({
        name,email
    })

   }
   const {_id}=user;
   const token=jwt.sign({_id,email},
       process.env.JWT_SECRET,
       {
           expiresIn:process.env.JWT_TIMEOUT
       }
   )
   return res.cookie(200).json({
    "authToken":"success",
    "token":token,
    httpOnly: true, 
    secure: false 
   })
    }

    catch (err){
        res.status(500).json({"errorss":err})
    }
}

export default googleLogin