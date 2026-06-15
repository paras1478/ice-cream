import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (data.success && data.data.user && data.data.token) {
            return {
              id: data.data.user._id,
              email: data.data.user.email,
              name: data.data.user.name,
              role: data.data.user.role,
              accessToken: data.data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      }

      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
