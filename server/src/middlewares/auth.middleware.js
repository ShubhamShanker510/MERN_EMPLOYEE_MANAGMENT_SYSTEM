import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'

const authenticate=(req,res,next)=>{
    //get the tokens from cookies or Authorization header
    const token=req.cookies.accessToken || req.headers['authorization']?.split(' ')[1];

    if(!token){
        return next(new ApiError(401, "Access token is required"));
    }

    //verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            return next(new ApiError(403, "Invalid Access token"))
        }
        //attach user info to the req object

        req.user=user;
        next();
    })

}

export default authenticate;