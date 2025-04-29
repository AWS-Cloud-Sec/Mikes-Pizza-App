/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  webpack: (config) => {
    config.cache = false; // <-- disable caching temporarily
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "mikes-pizza-assets.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "mikes-pizza-assets2.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
