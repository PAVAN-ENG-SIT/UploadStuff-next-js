import NextAuth from "next-auth";//higher version of the nextauth is installed so the import is changed to this.


// 1. Import your providers (e.g., GitHub, Google, or Credentials)
// import GitHub from "next-auth/providers/github" 

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // GitHub, 
    // Add your providers here
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    // In v5, 'authorized' receives 'auth' (the session) and 'request'
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // AUTH WHITELIST: Always allow these
      if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/register"
      ) {
        return true;
      }

      // CONTENT WHITELIST: Publicly accessible routes
      if (pathname === "/" || pathname.startsWith("/api/videos")) {
        return true;
      }

      // PROTECTED ROUTES: Check if session exists
      // !!auth converts the session object to a boolean (true if logged in)
      return !!auth;
    },
  },
});

// 2. EXPORT THE MIDDLEWARE
// In v5, the 'auth' function itself acts as the middleware wrapper
export default auth;

// 3. MATCHER CONFIG
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
