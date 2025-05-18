import jwt from "jsonwebtoken";
import { User } from "../models/userModels.js";
import { ApiResponse } from "../Utils/Apiclass.js";
import { APIError } from "../Utils/API.js";

const authMiddleware = async (req ,res , next) => {
    try {
        console.log("req.cookies",req.cookies)
        const token = req.cookies?.access_token 
        // || req.header('authorization')?.replace('Bearer' , '');
        console.log("Decode is",token)
        if(!token) return res.status(401).json({message : "Not authorized"})
        const decode = await jwt.verify(token ,process.env.ACCESS_SECRET_TOKEN)
        if(!decode) throw new ApiResponse(401 , "Not authorized");
    
        const user = User.findById(decode._id)
        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401 , error.message);
   
    }
}

export {authMiddleware}