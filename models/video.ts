// Import mongoose and some helper functions from mongoose
// Schema -> used to define structure of data
// model -> used to create a model
// models -> checks if model already exists (useful in Next.js hot reload)
import mongoose ,{Schema,model,models}from "mongoose";


// Default video dimensions (1080x1920 - commonly used for vertical videos)
export const VIDEO_DIMENSIONS = {
    width :1080,
    height:1920,
}as const;
// "as const" makes these values read-only so they cannot be changed later



// TypeScript interface that defines how a video object should look
export interface IVideo{

    // MongoDB unique ID for each document
    id?: mongoose.Types.ObjectId

    // Video title
    title:string;

    // Video description
    description:string;

    // URL where the video file is stored
    videourl:string;

    // URL of the thumbnail image
    thumbnailurl:string;

    // Boolean value to enable or disable video controls
    controls?:boolean;

    // Transformation settings for the video
    transformation?:{

        // Height of the video
        height: number;

        // Width of the video
        width:number;

        // Optional quality setting (like compression level)
        quality?:number;

    };

}



// Create the Mongoose schema for videos
const videoSchema = new Schema<IVideo>(
{

// Title field
// type:String -> data type
// required:true -> must be provided
title:{type:String,required:true},

// Description field
description:{type:String,required:true},

// URL of the video file
videourl:{type:String,required:true},

// URL of the thumbnail image
thumbnailurl:{type:String,required:true},

// Controls setting for video player
controls:{type:Boolean,required:true},


// Transformation settings object
transformation:{

    // Height of video
    // default value is taken from VIDEO_DIMENSIONS
    height:{type: Number,default:VIDEO_DIMENSIONS.height},

    // Width of video
    width:{type: Number,default:VIDEO_DIMENSIONS.width},

    // Quality setting (must be between 1 and 100)
    quality:{type: Number,min:1,max:100},
},

},

// Schema options
{
    // Automatically adds createdAt and updatedAt fields
    timestamps:true
}

);



// Create the Video model
// models?.Video -> checks if model already exists
// If not, it creates a new model
const Video = models?.Video || model<IVideo>("Video",videoSchema);


// Export the model so it can be used in other files
export default Video;