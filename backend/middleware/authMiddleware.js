const jwt=require("jsonwebtoken");
const User=require("../models/User");
const protect=async(req,res,next)=>{
    try{
        let token=req.headers.authorization;
        if(token && token.startsWith("Bearer ")){
            token=token.split(" ")[1];// extract token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({error:"Not authorized, user no longer exists"});
            }
            next();
        }else{
            res.status(401).json({error:"Not authorized, no token"});
        }
    }catch(err){
        res.status(401).json({error:"Not authorized, token failed"});
    }
};
module.exports={protect};