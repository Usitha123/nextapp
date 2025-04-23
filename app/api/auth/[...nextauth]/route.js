import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Create the authentication handler
const handler = NextAuth(authOptions);

// Only export the HTTP method handlers
export { handler as GET, handler as POST };

// Remove this line - it's causing the error
// export { authOptions };