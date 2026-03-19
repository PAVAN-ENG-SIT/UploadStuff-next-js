// Import the Connection type from mongoose
// This represents the active connection to MongoDB
import { Connection } from "mongoose";


// declare global is used to extend the global Node.js types
// It allows us to add our own custom global variables
declare global {

    // Creating a global variable called "mongoose"
    var mongoose : {

        // conn stores the actual MongoDB connection
        // It can either be a Connection object or null (if not connected yet)
        conn : Connection | null;

        // promise stores the connection promise
        // This is used when the connection is still being created
        promise : Promise<Connection> | null 
    }
}


// This empty export makes this file a module
// Without this, TypeScript may treat it as a global script and give errors
export {}