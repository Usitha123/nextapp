import NextAuth from "next-auth";
import { authOptions } from "./config"; // or "../../../lib/auth/authOptions" if you placed it elsewhere

// Create and export the handler functions
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);