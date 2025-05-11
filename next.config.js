/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "img.logo.dev", // Add more if needed
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      timeout: 30, // 30 seconds
    },
  },
};

module.exports = nextConfig;