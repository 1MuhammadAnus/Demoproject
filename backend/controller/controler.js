import asyncHandler from '../Utils/asyncHandler.js'
import {User} from '../models/userModels.js'
import { APIError } from '../Utils/API.js'
import {uploadCloudinary} from '../Utils/cloudinary.js'
// console.clear()
export const registeruser = asyncHandler(async (req , res)=>{
    const {username , email , password ,avatar }= req.body
    console.log({username , email , password})
    if(username === "" || email === "" || password === ""){
        throw new APIError(400 ,"Please fill all the fields")
    }
    if (
        [ username , email ].some((fields)=>{
            fields?.trim() === " " 
        })
    ){
        
        throw new APIError(400 ,"Please fill all the fields")
    }

    const finduser = await User.findOne({
        $or:[ {username , email}]
    })

    if(finduser){
        throw new APIError(400 ,"User already exist")
    }

    const avater = req.files?.avatar[0]?.path
    const coverImage = req.files?.coverImage[0]?.path
    console.log(req.files? "file gound ":" file not ")
    console.log('cvr img in controler' , coverImage.url)
    
    
    if(!avater){
        throw new APIError(400 ,"Please upload a valid avatar")
    }
    
    const uploadavatar = await uploadCloudinary(avater)
    const uploadcoverImage = await uploadCloudinary(coverImage)
    console.log('avatar in controler' , uploadavatar.url)
    console.log('avatar in controler' , uploadcoverImage.url)
    // console.log("upload avatar is" , uploadavatar)
    if(!uploadavatar){
        throw new APIError(500 ,"Error in uploading avatar")
    }
    if(!uploadcoverImage){
        throw new APIError(500 ,"Error in uploading cover image")
    }
    

   const user = await User.create({
        username : username.toLowerCase() , 
        email , 
        avatar : uploadavatar.url , 
        coverImage : uploadcoverImage?.url || "" , 
        password 
    })
    
    const finduserbyid = await User.findById(user._id).select(
        "-password"
    )
    
    if(finduserbyid){
        console.log('user save and found')
    }

    if(!finduserbyid){
        throw new APIError(500 ,"Error in finding user")
    }

    res.status(201).json({
        status : "success" ,
        message : "User created successfully" ,
        data : finduserbyid
    })

})

