import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("No user found with the given email.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Incorrect password.");
          }

          // Return user object to be stored in session
          return { email: user.email, role: user.role }; // Include user role if needed
        } catch (error) {
          console.error("Error: ", error);
          throw new Error(error.message); // Throw the error message
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/auth/error", // Redirect to an error page if needed
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to the token if user is present
      if (user) {
        token.role = user.role; // Storing user role in token
      }
      return token;
    },
    async session({ session, token }) {
      // Include the user role in the session
      if (token) {
        session.user.role = token.role; // Accessing role from token
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
