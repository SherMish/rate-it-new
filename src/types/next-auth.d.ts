import { DefaultSession } from 'next-auth';
import NextAuth from "next-auth"

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isWebsiteOwner: boolean;
      isVerifiedWebsiteOwner: boolean;
      businessId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      websites?: string;
      relatedWebsite?: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    role: string;
    isWebsiteOwner: boolean;
    isVerifiedWebsiteOwner: boolean;
    businessId?: string;
    websites?: string;
    relatedWebsite?: string;
  }
} 