import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // Set the session max age 7 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token, user }) {
      // console.log(JSON.stringify(session));
      // console.log("Session callback called");
      if (session.user) {
        //session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("Jwt callback called");
      return token;
    },
  },
});

export { handler as GET, handler as POST };
