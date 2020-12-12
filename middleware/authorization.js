


const jwt = require("jsonwebtoken");
const Camper_user = require("../models/camper");

const auth = async(req,res,next)=>{
    try {
    if(!req.header("Authorization"))
    {
        throw new Error("Token Required");
    }
    const token = req.header("Authorization").replace("Bearer ","");
    console.log(token);
    const user_with_token = jwt.verify(token,process.env.JWT_KEY);
    console.log(user_with_token);
    const user = await Camper_user.findOne({_id:user_with_token._id});
    req.profile = user;
    next();
    } catch (error) {
        res.send(error.message);
    } 
}

module.exports = auth;