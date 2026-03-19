// Import mongoose library to connect Node.js with MongoDB
import mongoose from "mongoose";


// Get MongoDB connection string from environment variables
// The "!" tells TypeScript that the value will definitely exist
const MONGODB_URL = process.env.MONGODB_URL!


// Check if the environment variable exists
// If it does not exist, throw an error and stop the application
if(!MONGODB_URL){
    throw new Error("please define mongo_uri in env variables");
}


// Get the cached mongoose connection from global object
// This is used to avoid creating multiple connections
let cached = global.mongoose


// If there is no cached object yet
// create one with default values
if(!cached){
    global.mongoose = {conn:null,promise:null}
}


// Function to connect to the database
export async function connectToDB(){

    // If a connection already exists, return it
    if(cached.conn){
        return cached.conn;
    }

    // If there is no connection promise yet
    if(!cached.promise){

        // Options for mongoose connection
        const optns = {

            // Allows mongoose to buffer commands until connection is ready
            bufferCommands : true,

            // Maximum number of database connections in the pool
            maxPoolSize :10,
        }

       // Create a new connection promise
        cached.promise=mongoose
        .connect(MONGODB_URL,optns)
        .then(()=> mongoose.connection)

    }

    // Try to resolve the connection promise
    try{

        // Wait until the connection is established
        cached.conn = await cached.promise

    }

    catch(error){
        
        // If connection fails, reset promise
        cached.promise = null

        // Throw the error
        throw error
    }

    // Return the database connection
    return cached.conn;
}