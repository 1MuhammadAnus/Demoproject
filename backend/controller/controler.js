import asyncHandler from '../Utils/asyncHandler.js'
import {User} from '../models/userModels.js'
import { APIError } from '../Utils/API.js'
import {uploadCloudinary} from '../Utils/cloudinary.js'
// console.clear()
export const registeruser = asyncHandler(async (req , res)=>{
    const {username , email , password}= req.body
    console.log({username , email , password})

    if (
        [ username , email ].some((fields)=>{
            fields?.trim() === "" 
        })
    ){
        throw new APIError(400 ,"Please fill all the fields")
    }

    const finduser = User.findOne({
        $or:[ {username , email}]
    })

    if(finduser){
        throw new APIError(400 ,"User already exist")
    }

    const avater = req.file?.avatar[0]?.path
    const coverImage = req.file?.coverImage[0]?.path

    if(!avater){
        throw new APIError(400 ,"Please upload a valid image")
    }

    const uploadavatar = uploadCloudinary(avater)
    const uploadcoverImage = uploadCloudinary(coverImage)

    if(uploadavatar){
        throw new APIError(500 ,"Error in uploading avatar")
    }

    if(uploadcoverImage){
        throw new APIError(500 ,"Error in uploading cover image")
    }

   const user = await User.create({
        username : username.toLowerCase() , 
        email , 
        avatar : avater , 
        cpverImage : coverImage?.url || "" , 
        password 
    })
    
    const finduserbyid = awaitUser.findById(user._id).select(
        "-password"
    )

    if(!finduserbyid){
        throw new APIError(500 ,"Error in finding user")
    }

    res.status(201).json({
        status : "success" ,
        message : "User created successfully" ,
        data : finduserbyid
    })

})

