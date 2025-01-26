// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/lib/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const user = await authenticateUser(
            credentials.email,
            credentials.password
          );
          
          if (user) {
            return user;
          }
          
          throw new Error("Invalid credentials");
          
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.model = user.model;
        token.name = user.name;
        token.canteenName = user.canteenName;
        token.canteenNamecashier = user.canteenNamecashier;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.model = token.model;
        session.user.name = token.name;
        session.user.canteenName = token.canteenName;
        session.user.canteenNamecashier = token.canteenNamecashier;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };