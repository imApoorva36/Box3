import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.id_token = token.id_token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };