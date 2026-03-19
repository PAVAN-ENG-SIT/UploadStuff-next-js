// Import mongoose and specific helpers from mongoose
// Schema -> used to define the structure of the data
// model -> used to create a model from schema
// models -> used to check if the model already exists (prevents errors in Next.js)
import mongoose ,{Schema,model,models}from "mongoose";

// Import bcrypt library to hash passwords for security
import bcrypt from "bcryptjs";


// TypeScript interface that defines the structure of a User object
export interface Myuser{

    // User email
    email:string;

    // User password
    password:string;

    // MongoDB automatically creates an ObjectId for each document
    _id?:mongoose.Types.ObjectId;

    // Automatically created timestamp when the document is created
    createdAt?:Date;

    // Automatically updated timestamp when document changes
    updatedAt?:Date;

}


// Create a schema that defines how user data will be stored in MongoDB
const userSchema = new Schema<Myuser>(

    {
        // Email field
        // type:String -> data type
        // required:true -> user must provide email
        // unique:true -> two users cannot have same email
        email:{type:String,required:true,unique:true},

        // Password field
        // required:true -> password must be provided
        password:{type:String,required:true}

},

{
    // Automatically adds createdAt and updatedAt fields
    timestamps:true
}
);


// Pre-save middleware
// This runs automatically before a document is saved in MongoDB
userSchema.pre("save",async function(){

    // Check if the password field was modified
    if(this.isModified("password")){

    // Hash the password using bcrypt with salt rounds = 10
    this.password = await bcrypt.hash(this.password,10);
    }

    // Continue saving the document
   
});


// Create the User model
// models?.User -> check if the model already exists
// model() -> create the model if it does not exist
const User = models?.User || model<Myuser>("User",userSchema)


// Export the User model so it can be used in other files
export default User

//simple code flow

// User registers
//       ↓
// Data sent to backend
//       ↓
// User Schema validates email & password
//       ↓
// Pre-save middleware runs
//       ↓
// Password gets hashed
//       ↓
// Hashed password stored in MongoDB