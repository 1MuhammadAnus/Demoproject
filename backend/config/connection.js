import mongoose from "mongoose";

const connection = async()=>{
    try{
        const con_info = await mongoose.connect('mongodb://127.0.0.1:27017/test')
        if(con_info){
            console.log('connected to db')
        }else {
            console.log('conn error')
        }
    }
    catch (error) {
        console.log('error',error)
        throw new error
        process.exit(1)
    }
}

export default connection