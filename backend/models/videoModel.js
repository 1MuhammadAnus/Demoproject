import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    dislikes: {
        type: Number,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId, 
        ref:"User"
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate)
export const videoMoel = mongoose.model("Video", videoSchema);
