import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import connectDB from "@/lib/mongodb";
import { sendUserSignupAlert } from "@/lib/telegram";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: (user._id as any)?.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        } as any;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl) || url.startsWith("/")) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // First check if this Google ID is already used by another user
          const userWithGoogleId = await User.findOne({ googleId: user.id });
          
          if (userWithGoogleId) {
            // Google ID already exists, check if it's the same email
            if (userWithGoogleId.email === user.email) {
              // Same user, allow sign in
              return true;
            } else {
              // Different user with same Google ID - this shouldn't happen but handle it
              console.error(`Google ID ${user.id} already exists for different email: ${userWithGoogleId.email} vs ${user.email}`);
              return false;
            }
          }

          // Check if user already exists by email
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: user.id,
              hashedPassword: await bcrypt.hash(Math.random().toString(36), 12),
              emailVerified: new Date(),
            });

            // Send Telegram alert for new Google sign-up
            await sendUserSignupAlert({
              name: user.name || 'משתמש Google',
              email: user.email || '',
              signupMethod: 'Google OAuth',
              isAgreeMarketing: false, // Google signups don't have marketing preference
            });
          } else if (!existingUser.googleId) {
            // If user exists but doesn't have googleId, update it
            // But first double-check no one else has this Google ID
            const duplicateCheck = await User.findOne({ googleId: user.id });
            if (duplicateCheck && (duplicateCheck._id as any)?.toString() !== (existingUser._id as any)?.toString()) {
              console.error(`Cannot assign Google ID ${user.id} to user ${existingUser.email} - already used by ${duplicateCheck.email}`);
              return false;
            }
            
            const updatedUser = await User.findByIdAndUpdate(
              existingUser._id,
              {
                googleId: user.id,
                image: user.image || existingUser.image,
              },
              { new: true }
            );
          }

          return true;
        } catch (error) {
          console.error("Error in Google Sign In:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Always ensure we have a user object if we have a token
      if (token && token.email) {
        try {
          // Initialize user from token data
          session.user = {
            ...session.user,
            id: (token.sub || token.id) as string,
            name: token.name as string,
            email: token.email as string,
            image: token.picture as string,
            role: (token.role as string) || "user",
            websites: token.websites as string | undefined,
            isWebsiteOwner: (token.isWebsiteOwner as boolean) || false,
            isVerifiedWebsiteOwner: (token.isVerifiedWebsiteOwner as boolean) || false,
          };

          // Then try to get fresh data from database
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });

          if (dbUser) {
            // Update with fresh database data
            session.user = {
              ...session.user,
              id: (dbUser._id as any)?.toString(),
              role: dbUser.role,
              websites: dbUser.websites?.toString(),
              isWebsiteOwner: dbUser.isWebsiteOwner,
              isVerifiedWebsiteOwner: dbUser.isVerifiedWebsiteOwner,
            };
          }
        } catch (error) {
          console.error("Error in session callback:", error);
          // If database fails, at least use token data
          session.user = {
            id: (token.sub || token.id) as string,
            name: token.name as string,
            email: token.email as string,
            image: token.picture as string,
            role: (token.role as string) || "user",
            websites: token.websites as string | undefined,
            isWebsiteOwner: (token.isWebsiteOwner as boolean) || false,
            isVerifiedWebsiteOwner: (token.isVerifiedWebsiteOwner as boolean) || false,
          };
        }
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        // Update token data if session is updated
        return { ...token, ...session.user };
      }

      // Always fetch fresh user data from database when token is accessed
      // This ensures the JWT token stays in sync with database changes
      if (token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.websites = dbUser.websites?.toString();
            token.isWebsiteOwner = dbUser.isWebsiteOwner;
            token.isVerifiedWebsiteOwner = dbUser.isVerifiedWebsiteOwner;
          }
        } catch (error) {
          console.error("Error fetching fresh user data in jwt callback:", error);
        }
      }
      
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
