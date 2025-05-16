import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//cloudname = 'dafuog4wr'
// api_key = '385914851849111'
// api_secret = 'c5sFvPJrDv0323YYp1hE6mSmcy0'

cloudinary.config({
    cloud_name : 'dafuog4wr',
    api_key : '385914851849111',
    api_secret : 'c5sFvPJrDv0323YYp1hE6mSmcy0'
})

// console.log('File is uploaded on cloudinary with lclpth' , localPath)
// console.log('cmng file with',localPath)
const uploadCloudinary = async function(localPath){
    try {
        if(!localPath) return null
        const fileUploaded = await cloudinary.uploader.upload(localPath , {
            resource_type : "auto"
        })
        // .then(result=>console.log('1 is uploaded of url'))
        // .catch(error=>console.log('error in catch' , error))
        console.log( 'accessing url ' ,  fileUploaded.url)
        return fileUploaded
    } catch (error) {
        fs.unlinkSync(localPath, (err) => {
            if (err) throw err;
        });
        console.log("error :" , error)
        console.log('File is not uploaded on cloudinary')
        return null
    }
    
}

export {uploadCloudinary}