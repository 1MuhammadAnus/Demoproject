import asyncHandler from '../Utils/asyncHandler.js'

 export const registeruser = asyncHandler(async (req , res)=>{
    res.status(200).json({
        message:"user registered"
    })
})

