import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import connectDB from '@/lib/mongodb';


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        return url;
      }
      return baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          console.log("Google sign in attempt:", { 
            email: user.email,
            name: user.name,
            id: user.id 
          });
          
          await connectDB();
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          console.log("Existing user check:", { exists: !!existingUser });
          
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
            console.log("New user created:", { id: newUser._id });
          } else if (!existingUser.googleId) {
            // If user exists but doesn't have googleId, update it
            const updatedUser = await User.findByIdAndUpdate(existingUser._id, {
              googleId: user.id,
              image: user.image || existingUser.image,
            }, { new: true });
            console.log("Updated existing user with Google ID:", { id: updatedUser._id });
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
      if (session?.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser) {
            // Ensure we're copying all relevant fields
            session.user = {
              ...session.user,
              id: dbUser._id.toString(),
              role: dbUser.role,
              websites: dbUser.websites,
              isWebsiteOwner: dbUser.isWebsiteOwner,
              isVerifiedWebsiteOwner: dbUser.isVerifiedWebsiteOwner
            };
            
            // Also update the token
            token.role = dbUser.role;
            token.websites = dbUser.websites;
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        // Update token data if session is updated
        return { ...token, ...session.user };
      }

      if (account?.type === "oauth" && user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.websites = dbUser.websites;
          }
        } catch (error) {
          console.error("Error in jwt callback:", error);
        }
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 