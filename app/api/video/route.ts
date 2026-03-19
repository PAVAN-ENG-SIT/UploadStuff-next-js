// Import configuration for NextAuth to verify user sessions
import { authOptions } from "@/lib/auth"; 
// Import helper to connect to MongoDB (ensures database isn't disconnected)
import { connectToDB } from "@/lib/db"; 
// Import the TypeScript interface for video data type safety
// ERROR HERE: You imported 'Video' from a UI library instead of your Database Model
import Video, { IVideo } from "@/models/video"; 
// Import NextAuth helper to get user session data on the server
import { getServerSession } from "next-auth"; 
// Standard Next.js server components for handling web requests/responses
import { NextRequest, NextResponse } from "next/server"; 

// The function that runs when someone visits the API URL (GET request)
export async function GET() {
  try {
    await connectToDB(); // Establish database connection
    // Find all videos, sort by newest first, and convert to plain JS objects (.lean)
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    
    // If no videos, return an empty list; otherwise return the video data
    return NextResponse.json(videos || []);
  } catch (error) {
    // Return a 500 Server Error if the database fails
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// The function that runs when someone submits data (POST request)
export async function POST(request: NextRequest) {
  try {
    // ERROR HERE: This must be 'await'. Without it, 'session' is a Promise, not the user.
    const session = await getServerSession(authOptions);
    
    // Check if the user is logged in; if not, block the request
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB(); // Ensure DB is connected
    const body: IVideo = await request.json(); // Parse the incoming JSON data

    // Validate that all required info (title, urls, etc.) was actually sent
    if (!body.title || !body.description || !body.videourl || !body.thumbnailurl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Prepare the final object, setting defaults for controls/quality if missing
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    // Save the data to MongoDB
    const newVideo = await Video.create(videoData);
    // Return the newly created video object to the frontend
    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
