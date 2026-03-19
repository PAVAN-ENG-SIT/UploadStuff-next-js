import { NextAuthOptions } from "next-auth"; // Imports the TypeScript type to ensure our configuration object follows the correct structure
import CredentialsProvider from "next-auth/providers/credentials"; // Imports the provider that handles custom email/password logins
import { connectToDB } from "./db"; // Imports your custom function to establish a connection to MongoDB
import User from "@/models/User"; // Imports your Mongoose User model to perform database queries
import bcrypt from "bcryptjs"; // Imports the library used to compare the plain-text password with the hashed version in the DB

// Defining the main configuration object for NextAuth
export const authOptions: NextAuthOptions = {
  // The 'providers' array lists the different ways a user can log in (Google, GitHub, etc.)
  providers: [
    // Setting up the custom email/password login strategy
    CredentialsProvider({
      name: "Credentials", // The name displayed on the default NextAuth login page
      credentials: {
        // Defines the fields required for the login form
        email: { label: "Email", type: "text" }, // Creates an input field for the Email
        password: { label: "Password", type: "password" }, // Creates an input field for the Password
      },
      // The core logic that determines if a user is allowed to log in
      async authorize(credentials) {
        // Basic check: stop early if the user didn't provide both fields
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        try {
          // Connect to your database before performing any queries
          await connectToDB();
          
          // Look for a user in the database whose email matches the input
          const user = await User.findOne({ email: credentials.email });

          // If no user is found, reject the login attempt
          if (!user) {
            // Using a generic error message prevents hackers from knowing if an email exists
            throw new Error("Invalid credentials");
          }

          // Compare the password from the form with the encrypted password in the database
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If the password doesn't match, reject the login
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          // On success, return the user data; NextAuth will now create a session for them
          return {
            id: user._id.toString(), // Convert MongoDB ObjectId to a string
            email: user.email,
            name: user.name, // Passes the name property to the session if it exists
          };
        } catch (error) {
          // Log the actual error for the developer to see in the terminal
          console.error("Auth error:", error);
          // Throw a generic error for the user to see in the browser
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  // Callbacks are functions that control what happens when a user logs in or a session is checked
  callbacks: {
    // This runs whenever a JSON Web Token (JWT) is created or updated
    async jwt({ token, user }) {
      // If it's the first time the user logs in, we attach their DB ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This runs whenever the frontend asks for the session data (e.g., via useSession)
    async session({ session, token }) {
      // We take the ID we stored in the token and put it into the session object
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session; // Now you can access 'session.user.id' in your React components
    },
  },
  // Customizes the URLs for authentication pages
  pages: {
    signIn: "/login", // Redirects users to '/login' instead of the default NextAuth page
    error :"/login",
  },
  // Defines how sessions are managed
  session: {
    strategy: "jwt", // Uses JSON Web Tokens for sessions (stateless) instead of database sessions
      maxAge: 30 * 24 * 60 * 60, //30 days limit
  },
  // A unique string used to sign the JWTs; critical for security in production
  secret: process.env.NEXTAUTH_SECRET, 
};
