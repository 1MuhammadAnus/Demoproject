import asyncHandler from '../Utils/asyncHandler.js'
import {User} from '../models/userModels.js'
import { APIError } from '../Utils/API.js'
import {uploadCloudinary} from '../Utils/cloudinary.js'
import { ApiResponse } from '../Utils/Apiclass.js'
import { JsonWebTokenError } from 'jsonwebtoken'
// console.clear()

const generateAccessandRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId)
        // const access_token = user.getJWTToken()
        const access_token = user.GenerateToken()
        const refresh_token = user.GenerateRefreshToken()
        // console.log("user at genacces" , refresh_token)
        user.refresh_token = refresh_token
        user.save({validateBeforeSave : false})
        console.log("user at genacces" , access_token)
        return {access_token , refresh_token}
    } catch (error) {
        throw new APIError(500 , "Internal Server Error")
    }
} 

const registeruser = asyncHandler(async (req , res)=>{
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

const functionlogedin = asyncHandler(async(req , res)=>{
    const {username , email, password} = req.body
    console.log("functionlogedin" , req.body)
    console.log(username , email , password)
    if(!username || !email){
        throw new APIError(400 , "username and email required")
    }

    const user = await User.findOne({
        $or:[
            {username} , {email}
        ]
    })

    if(!user){
        throw new APIError(400 , "user not found")
    }

    const isMatch = await user.isPasswordcorrect(password)
    console.log('go for tokens')
    const {access_token , refresh_token }= await generateAccessandRefreshToken(user._id)
    console.log("Acctoken" , access_token)
    const user_found = await User.findById(user._id).select(
        "-password -refresh_token"
    )

    const options ={
        httpOnly : true ,
        secure : true 
    }
    // console.log(cookie("access_token" , accesstoken , options))
    return res
    .status(200)
    .cookie("access_token" , access_token , options)
    .cookie("refresh_token" , refresh_token , options)
    .json(
            new ApiResponse(200 , 
                {
                    user : user_found , 
                    access_token , 
                    refresh_token , 
                    message : "user logged in successfully" 
            }, 
            "user logged in successfully" )       
    )
   
})

const logout = asyncHandler(async (req ,res) => {
    const user = req.user
    await User.findByIdAndUpdate(user._id , 
        {
            $set : {refresh_token : undefined}
        },
        {new : true}
    )
    const options ={
        httpOnly : true ,
        secure : true 
    }
    return res
    .clearCookie("access-token" , options)
    .clearCookie('refresh-token' , options)
    .json(
         new ApiResponse(200 , {} , "user logged out successfully" )       
    ) 
})

const sentAccessToken = asyncHandler(async(req , res)=>{
    const incomingToken = req.cookies.access_token || req.headers('authorization').replace('Bearer ' , '').trim()
    console.log(token)
    if(!token){throw new APIError(401 , "Please login to continue")}
    const decode = jwt.verify(token , process.env.REFRESH_SECRET_TOKEN)
    const user = await User.findById(decode._id)
    if( incomingToken !== user?.refresh_token){
        throw new APIError(401 , "Please login to continue")
    }

    const options = {
        httpOnly : true,
        secure : true
    }

    const {access_token , refresh_token }= await generateAccessandRefreshToken(user._id)

    res 
    .status(200)
    .cookie('access-token' , access_token , options)
    .cookie('refresh-token' , refresh_token , options)
    .json(
        new ApiResponse(200 , {
            user : user,
            access_token,
            refresh_token : refresh_token
        } , "user logged in successfully" )       
    )
}) 

export { 
    registeruser, 
    functionlogedin, 
    logout,
    sentAccessToken
}

