import Mongoose ,{Schema, Types} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username:{
        type: String,
        required : true,
        unique:true , 
        trim : true ,
        lowercase : true,
    },
    email:{
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password:{
        type : String,
        required : true,
    },
    watchVideo : [
        {
            type : Types.ObjectId,
            ref : "video"
        }
    ],
    avatar:{
        type : String,
    },
    coverImage:{
        type : String,
    },
    bio:{
        type : String,
    },
    // followers:{
    //     type : [Types.ObjectId],
    //     ref : "user"
    // },
    // following:{
    //     type : [Types.ObjectId],
    //     ref : "user"
    // },
    refresh_token :{
        type: String
    },
    isAdmin :{
        type : Boolean,
        default : false,
    }
},{ timestamp: true })

userSchema.pre('save' , async function(next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,10)
    }
})
 userSchema.methods.isPasswordcorrect = async function (pass){
    return await bcrypt.compare(pass , this.password)
}

userSchema.methods.GenerateToken = function(){
    return jwt.sign({
        _id:this.id,
        username :this.username,
        email : this.email
    },
    process.env.ACCESS_SECRET_TOKEN,
    {
        expiresIn : process.env.EXPIRY_SECRET_TOKEN
    }
 )
}

userSchema.methods.GenerateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    },
    process.env.REFRESH_SECRET_TOKEN,
    {
        expiresIn : process.env.EXPIRY_REFRESH_TOKEN
    }

)
}
export const User = Mongoose.model("user", userSchema)