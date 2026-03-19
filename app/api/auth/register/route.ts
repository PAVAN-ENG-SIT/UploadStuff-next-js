// Import database connection function
// This connects the application to MongoDB
import { connectToDB } from "@/lib/db";

// Import the User model
// This model is used to interact with the users collection in MongoDB
import User from "@/models/User";

// Import request and response helpers from Next.js
import { NextRequest, NextResponse } from "next/server";


// Create a POST API handler
// This function runs when a POST request is sent to this route
export async function POST(request: NextRequest){

    try{

    // Read JSON data sent in the request body
    const {email, password} = await request.json() 


        // Check if email or password is missing
        if(!email || !password){

            // Send error response if required fields are missing
            return NextResponse.json(
                {error : "Email and password are required"},
                {status:400}
            )
        }


        // Connect to the MongoDB database
        await connectToDB()


        // Check if a user with this email already exists
        const existingUser = await User.findOne({email})


        // If user already exists, send error response
        if(existingUser){
            return NextResponse.json(
                {error : "User already registered"},
                {status:400}
            );
        }


        // Create a new user in the database
        await User.create({
            email,
            password
        })


        // Send success response after user creation
        return NextResponse.json(
            {message : "User registered successfully"},
            {status:201}
        );

}
    catch(error){

        // Log error in server console
        console.error("Registration error ",error);

        // Send error response if something fails
        return NextResponse.json(
            {error : "User failed to register "},
            {status:400}
        );
    }
}