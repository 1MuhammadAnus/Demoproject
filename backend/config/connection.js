import mongoose from "mongoose";
const connection = async()=>{
    try{
        const con_info = await mongoose.connect('mongodb+srv://seoexpert1223:chriaz987@cluster0.oejhh3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        if(con_info){
            console.log('connected to db')
        }
    }
    catch (error) {
        console.log('error',error)
        process.exit(1)
    }
}

export default connection