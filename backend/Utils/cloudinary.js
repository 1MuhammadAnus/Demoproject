import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name : process.env.cloudname,
    api_key : process.env.apikey,
    api_secret : process.env.apisecret
})

const uploadCloudinary = async function(localPath){
    try {
        if(!localPath) return null
        const fileUploaded = await cloudinary.uploader.upload(localPath , {
            resource_type : "auto"
        })
        console.log('File is uploaded on cloudinary')
        return fileUploaded
    } catch (error) {
        fs.unlinkSync(localPath, (err) => {
            if (err) throw err;
        });
        console.log('File is not uploaded on cloudinary')
        return null
    }
    
}

export {uploadCloudinary}